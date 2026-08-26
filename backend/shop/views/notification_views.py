from rest_framework import generics
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny

from ..models import (
    Product,
    ProductView,
    Notification,
    DeviceToken,
    CustomUser,
)
from ..serializers import NotificationSerializer
from ..utils import send_push
from ..models import DeviceToken


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def track_view(request):
    product_id = request.data.get("product_id")

    try:
        product = Product.objects.get(product_id=product_id)

        view, created = ProductView.objects.get_or_create(
            user=request.user,
            product=product,
        )

        if not created:
            view.view_count += 1
            view.save()

        return Response({"success": True})

    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        # Admin sees all notifications
        if self.request.user.role == CustomUser.Roles.ADMIN:
            return Notification.objects.all().order_by("-created_at")

        # Customer sees only their own notifications
        return Notification.objects.filter(user=self.request.user).order_by(
            "-created_at"
        )


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([AllowAny])
def save_device_token(request):

    token = request.data.get("token")

    if not token:
        return Response({"error": "Token missing"}, status=400)

    print("========== SAVE DEVICE TOKEN ==========")
    print("Received FCM token:", token)

    device, created = DeviceToken.objects.get_or_create(token=token)

    if request.user.is_authenticated:

        print("Authenticated user:", request.user.id)
        print("User:", request.user.first_name, request.user.last_name)

        if device.user_id != request.user.id:
            device.user = request.user
            device.save(update_fields=["user"])

            print("✅ Token associated with user:", request.user.id)

        else:
            print("✅ Token already belongs to this user")

    else:
        print("⚠️ Request is unauthenticated")

    return Response(
        {
            "message": "Device token saved",
            "created": created,
            "user_id": (request.user.id if request.user.is_authenticated else None),
        }
    )
