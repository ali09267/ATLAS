from django.db.models import Count

from shop.models import ProductView, Product, Order, OrderItem
from shop.ai.response_formatter import format_products
from shop.ai.response_formatter import (
    metric,
    table,
)


def recently_viewed_products(user):
    total_views = (
        ProductView.objects.filter(user=user)
        .select_related("product")
        .order_by("-viewed_at")
    )

    products = []
    seen = set()

    for view in total_views:

        if view.product_id not in seen:

            seen.add(view.product_id)

            products.append(view.product)

    return format_products(products)


def last_viewed_product(user):
    latest_view = (
        ProductView.objects.filter(user=user)
        .select_related("product")
        .order_by("-viewed_at")
        .first()
    )

    return format_products([latest_view.product])


def total_viewed_products(user):

    count = ProductView.objects.filter(user=user).values("product").distinct().count()

    return metric(
        title="Viewed Products",
        value=count,
    )


def most_viewed_products(user):

    most_viewed = (
        ProductView.objects.filter(user=user)
        .annotate(total=Count("product"))
        .order_by("-total")
        .first()
    )

    product = Product.objects.get(pk=most_viewed["product"])

    return format_products([product])


def has_viewed(user, product):
    item = (
        OrderItem.objects.filter(
            order__user=user,
            product__product_name__icontains=product,
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
        "message": f"You haven't purchased any product matching '{product}'.",
    }
