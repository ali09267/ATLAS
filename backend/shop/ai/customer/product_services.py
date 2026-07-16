from shop.models import Product
from shop.ai.response_formatter import format_products


def search_products(
    keyword=None,
    category=None,
    min_price=None,
    max_price=None,
):
    products = Product.objects.all()

    if keyword:
        products = products.filter(product_name__icontains=keyword)

    if category:
        products = products.filter(category__icontains=category)

    if min_price is not None:
        products = products.filter(price__gte=min_price)

    if max_price is not None:
        products = products.filter(price__lte=max_price)

    return format_products(products)
