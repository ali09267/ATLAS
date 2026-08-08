from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..models import CustomUser
from ..serializers import UserSerializer
from django.db.models import Q
from shop.pagination import StandardPagination


@api_view(["GET"])
def get_customers(request):
    search = request.GET.get("search", "").strip()

    users = CustomUser.objects.filter(role=CustomUser.Roles.CUSTOMER).order_by("id")

    if search:
        users = users.filter(
            Q(username__icontains=search)
            | Q(first_name__icontains=search)
            | Q(last_name__icontains=search)
            | Q(email__icontains=search)
        )

    paginator = StandardPagination()

    page = paginator.paginate_queryset(users, request)

    serializer = UserSerializer(page, many=True)

    return paginator.get_paginated_response(serializer.data)


@api_view(["PUT", "DELETE"])
def customer_detail(request, id):
    user = CustomUser.objects.get(id=id)

    if request.method == "PUT":
        user.first_name = request.data["first_name"]
        user.last_name = request.data["last_name"]
        user.email = request.data["email"]
        user.save()
        return Response(UserSerializer(user).data)

    if request.method == "DELETE":
        user.delete()
        return Response({"message": "deleted"})
