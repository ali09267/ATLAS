import json
import uuid

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from ..models import CustomUser


@csrf_exempt
def register(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
        first_name = data.get("first_name")
        last_name = data.get("last_name")

        if CustomUser.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already exists"}, status=400)

        user = CustomUser.objects.create_user(
            username=str(
                uuid.uuid4()
            ),  # unique placeholder; email/name are what we display
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password,
        )

        return JsonResponse({"message": "Account created successfully"})

    return JsonResponse({"error": "Invalid method"}, status=405)


@csrf_exempt
def user_login(request):
    """Session/JsonResponse-style login endpoint."""
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        try:
            user_obj = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return JsonResponse({"error": "Invalid credentials"}, status=401)

        # NOTE: username is a random uuid now, not the email - must look the
        # user up first and authenticate with their actual username value.
        user = authenticate(request, username=user_obj.username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return JsonResponse(
                {
                    "message": "Login successful",
                    "token": token.key,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                }
            )
        return JsonResponse({"error": "Invalid credentials"}, status=401)

    return JsonResponse({"error": "Invalid method"}, status=405)


@api_view(["POST"])
def login_view(request):
    """DRF/Token-style login endpoint (includes role/staff flags)."""
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        user_obj = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        return Response({"error": "Invalid credentials"}, status=400)

    # Same fix as above: authenticate with the actual username, not name fields.
    user = authenticate(username=user_obj.username, password=password)

    if user is None:
        return Response({"error": "Invalid credentials"}, status=400)

    login(request, user)

    token, _ = Token.objects.get_or_create(user=user)

    return Response(
        {
            "token": token.key,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
        }
    )


@csrf_exempt
def user_logout(request):
    logout(request)
    return JsonResponse({"message": "Logged out"})


def check_auth(request):
    if request.user.is_authenticated:
        return JsonResponse({"authenticated": True, "email": request.user.email})
    return JsonResponse({"authenticated": False})
