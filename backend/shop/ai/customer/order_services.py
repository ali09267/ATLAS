from shop.models import Order, OrderItem
from shop.ai.response_formatter import format_orders, format_products
from django.db.models import Count
from shop.ai.response_formatter import (
    metric,
    table,
)


def all_orders(user):
    orders = (
        Order.objects.filter(user=user)
        .prefetch_related("items__product")
        .order_by("-created_at")
    )

    return format_orders(orders)


def latest_order(user):
    order = (
        Order.objects.filter(user=user)
        .prefetch_related("items__product")
        .order_by("-created_at")
        .first()
    )

    if not order:
        return {"type": "chat", "message": "You haven't placed any orders yet."}

    return format_orders([order])


def orders_by_status(user, status):

    orders = (
        Order.objects.filter(
            user=user,
            status__iexact=status,
        )
        .prefetch_related("items__product")
        .order_by("-created_at")
    )

    return format_orders(orders)


def orders_between_dates(
    user,
    start_date,
    end_date,
):

    orders = (
        Order.objects.filter(
            user=user,
            created_at__date__range=(
                start_date,
                end_date,
            ),
        )
        .prefetch_related("items__product")
        .order_by("-created_at")
    )

    return format_orders(orders)


def purchased_products(user):

    items = OrderItem.objects.filter(order__user=user).select_related("product")

    products = []

    seen = set()

    for item in items:

        if item.product_id not in seen:

            seen.add(item.product_id)

            products.append(item.product)

    return format_products(products)


def has_purchased_product(
    user,
    keyword,
):

    item = (
        OrderItem.objects.filter(
            order__user=user,
            product__product_name__icontains=keyword,
        )
        .select_related("product")
        .first()
    )

    if item:

        return {
            "type": "chat",
            "message": f"Yes, you have purchased {item.product.product_name}.",
        }

    return {
        "type": "chat",
        "message": f"You haven't purchased any product matching '{keyword}'.",
    }


def total_orders(user):
    print("U CALLED ME")
    count = Order.objects.filter(user=user).count()
    print(count)
    return metric(
        title="Your Orders",
        value=count,
    )
