from django.db.models import Q

from shop.models import Product
from shop.serializers import ProductSerializer


def search_products(
    keyword=None,
    category=None,
    brand=None,
    min_price=None,
    max_price=None,
):
    """
    Exact product search.

    Returns:
        QuerySet[Product]
    """

    print("\n========== EXACT SEARCH ==========")
    print("Keyword   :", keyword)
    print("Category  :", category)
    print("Brand     :", brand)
    print("Min Price :", min_price)
    print("Max Price :", max_price)

    products = Product.objects.all()

    # ---------------- Category ----------------

    if category:
        products = products.filter(category__iexact=category.strip())

    # ---------------- Product ----------------

    if keyword:
        keyword = keyword.strip()

        products = products.filter(
            Q(product_name__icontains=keyword) | Q(desc__icontains=keyword)
        )

    # ---------------- Brand ----------------

    if brand:
        products = products.filter(brand__icontains=brand.strip())

    # ---------------- Price ----------------

    if min_price is not None:
        products = products.filter(price__gte=min_price)

    if max_price is not None:
        products = products.filter(price__lte=max_price)

    print("Products Found:", products.count())
    print(products.query)
    print("==================================\n")

    return products


def broad_candidate_search(
    keyword=None,
    category=None,
    brand=None,
):
    """
    Broad search used before semantic retrieval.

    Returns products that are POSSIBLY related.

    This intentionally uses OR conditions to
    gather a wider candidate pool.
    """

    print("\n====== BROAD CANDIDATE SEARCH ======")

    query = Q()

    if category:
        query |= Q(category__iexact=category.strip())

    if brand:
        query |= Q(brand__icontains=brand.strip())

    if keyword:
        keyword = keyword.strip()

        query |= Q(product_name__icontains=keyword)

        query |= Q(desc__icontains=keyword)

        query |= Q(specifications__icontains=keyword)

    products = Product.objects.filter(query).distinct()[:30]

    print("Candidate Products:", products.count())
    print(products.query)
    print("====================================\n")

    return products


def serialize_products(products):
    """
    Converts Product QuerySet into JSON.
    """

    return ProductSerializer(
        products,
        many=True,
    ).data


def get_all_categories():
    """
    Returns every available category.
    """

    return list(
        Product.objects.values_list(
            "category",
            flat=True,
        ).distinct()
    )
