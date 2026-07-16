# file which contains the analytics views for the shop app such as total no: of customers, total sales, total no: of products sold etc.

from rest_framework.decorators import (
    api_view,
)  # specifying the type of request(GET,POST,PUT,DELETE)
from rest_framework.response import Response

from shop.models import OrderItem, Product
from shop.services.analytics import (
    total_customers,
    top_selling_product,
)  # total no: of customers function imported from analytics.py file
from django.db.models import (
    Count,
    Sum,
)


@api_view(["GET"])
def analytics_test(
    request,
):  # testing the analytics service and checking if it is working properly or not

    return Response({"total_customers": total_customers()})


@api_view(["GET"])
def top_selling_product_view(request):

    result = (
        OrderItem.objects.values("product__product_name")
        .annotate(total_sold=Sum("quantity"))
        .order_by("-total_sold")
        .first()
    )

    if not result:
        return None

    return Response(result)
