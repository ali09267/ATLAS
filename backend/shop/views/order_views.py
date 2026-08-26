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
from django.db.models import Q
from shop.pagination import StandardPagination

STATUS_MESSAGES = {
    "PENDING": (
        "Order Received",
        "Your order containing {products} is pending confirmation.",
    ),
    "CANCELLED": (
        "Order Cancelled",
        "We are really thankful to you for shopping with us. But we are afraid that your order containing {products} has been cancelled.",
    ),
    "SHIPPED": (
        "Order Shipped",
        "Your order containing {products} is out for delivery.",
    ),
    "DELIVERED": (
        "Order Delivered",
        "Your order containing {products} has been successfully delivered. Thanks alot for shopping with us. We hope to see you again soon.",
    ),
}


@csrf_exempt
@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_order(request):
    data = request.data
    cart = data.get("cart", {})
    total_price = data.get("totalPrice")

    print("total_price:", total_price)

    order = Order.objects.create(user=request.user, total_price=total_price)

    for product_id, qty in cart.items():

        product = Product.objects.get(product_id=product_id)
        OrderItem.objects.create(
            order=order, product=product, quantity=qty, price=product.price
        )

    return Response(
        {"success": True, "order_id": order.id, "total_price": order.total_price}
    )


@api_view(["GET"])
def get_orders(request):
    search = request.GET.get("search", "").strip()

    orders = Order.objects.select_related("user").order_by("-created_at")

    if search:
        orders = orders.filter(Q(status__icontains=search))

    paginator = StandardPagination()

    page = paginator.paginate_queryset(orders, request)

    serializer = OrderSerializer(page, many=True)

    return paginator.get_paginated_response(serializer.data)


@api_view(["PATCH"])
def update_order_status(request, id):

    # Get order first
    order = Order.objects.get(id=id)
    # get order items (all products user ordered)
    order_items = order.items.select_related("product").all()

    # forming that product names and their respective quantity in product_names structured array
    product_names = [
        f"{item.product.product_name} × {item.quantity}" for item in order_items
    ]

    # to display in notification msg
    products_text = ", ".join(product_names) if product_names else "your items"
    print("========== UPDATE ORDER ==========")
    print("Order User ID:", order.user.id)
    print("Order User:", order.user.first_name)

    # Get all tokens for this user
    device_tokens = list(DeviceToken.objects.filter(user=order.user))
    print("Tokens found:", len(device_tokens))

    for device in device_tokens:
        print("Sending to:", device.user.first_name)
        print("FCM:", device.token[:30])

    # Update order status
    status = request.data.get("status")
    order.status = status

    print("Received status:", repr(status))
    print("Available STATUS_MESSAGES keys:", list(STATUS_MESSAGES.keys()))

    order.save()

    title, message_template = STATUS_MESSAGES.get(status, ("", ""))
    message = message_template.format(products=products_text)

    customer_name = order.user.first_name or order.user.username

    message = f"Hi {customer_name}, {message}"
    Notification.objects.create(
        user=order.user,
        order=order,
        title=title,
        message=message,
    )

    for device in device_tokens:
        try:
            result = send_push(
                device.token,
                title,
                message,
            )

            if result:
                print(
                    f"✅ Notification sent successfully " f"to {device.user.first_name}"
                )
        except Exception as e:
            print("❌ Notification failed:", e)

    return Response({"message": "Status Updated Successfully"})


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def latest_order(request):

    order = Order.objects.filter(user=request.user).order_by("-created_at").first()

    if not order:
        print("No orders found for user:", request.user)
        return Response(None)

    print("User Order:", order.total_price)

    serializer = OrderSerializer(order)

    print("Serialized Order:", serializer.data)

    return Response(serializer.data)
