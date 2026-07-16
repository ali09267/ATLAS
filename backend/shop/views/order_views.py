from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from shop.utils import send_push

from ..models import DeviceToken, Order, OrderItem, Product, Notification
from ..serializers import OrderSerializer

STATUS_MESSAGES = {
    "PENDING": ("Order Pending", "Your order #{id} is pending."),
    "CONFIRMED": ("Order Confirmed", "Your order #{id} has been confirmed."),
    "SHIPPED": ("Order Shipped", "Your rider is on the way."),
    "DELIVERED": ("Order Delivered", "Your order #{id} has been delivered."),
    "CANCELLED": ("Order Cancelled", "Unfortunately your order has been cancelled."),
}


@csrf_exempt
@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_order(request):
    data = request.data
    cart = data.get("cart", {})
    total_price = data.get("totalPrice")

    order = Order.objects.create(user=request.user, total_price=total_price)

    for product_id, qty in cart.items():
        product = Product.objects.get(product_id=product_id)
        OrderItem.objects.create(
            order=order, product=product, quantity=qty, price=product.price
        )

    return Response({"success": True, "order_id": order.id})


@api_view(["GET"])
def get_orders(request):
    orders = Order.objects.all().order_by("-created_at")
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(["PATCH"])
def update_order_status(request, id):
    order = Order.objects.get(id=id)
    status = request.data.get("status")

    order.status = status
    order.save()

    title, message_template = STATUS_MESSAGES.get(status, ("", ""))
    message = message_template.format(id=order.id) if message_template else ""

    Notification.objects.create(
        user=order.user, order=order, title=title, message=message
    )

    device_tokens = DeviceToken.objects.filter(user=order.user)

    for device in device_tokens:

        send_push(device.token, "Order Delivered", "Your order has been delivered.")
    print(Notification.objects.all())

    return Response({"message": "Status Updated Successfully"})
