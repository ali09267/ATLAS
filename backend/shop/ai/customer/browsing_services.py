from django.db.models import Count

from shop.models import ProductView
from shop.ai.response_formatter import format_products


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
    latest_product = (
        ProductView.objects.filter(user=user)
        .select_related("products")
        .order_by("-viewed_at")
        .first()
    )

    return format_products(latest_product)
