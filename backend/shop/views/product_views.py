from django.db.models import Q
from django.http import JsonResponse
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from ..models import Product
from ..serializers import ProductSerializer
from ..recommendations import get_recommendations


@api_view(["GET"])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


def api_product_detail(request, myid):
    p = Product.objects.get(product_id=myid)
    data = {
        "product_id": p.product_id,
        "product_name": p.product_name,
        "category": p.category,
        "price": p.price,
        "desc": p.desc,
        "image": f"http://127.0.0.1:8000/media/{p.image}" if p.image else "",
    }
    return JsonResponse(data)


@api_view(["GET"])
def search_products(request):
    query = request.GET.get("q", "")

    if query:
        products = Product.objects.filter(
            Q(product_name__icontains=query)
            | Q(desc__icontains=query)
            | Q(category__icontains=query)
        )
    else:
        products = Product.objects.all()

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(["GET", "POST"])
def products(request):
    if request.method == "GET":
        q = request.GET.get("q")
        products_qs = Product.objects.all()

        if q:
            products_qs = products_qs.filter(product_name__icontains=q)

        return Response(ProductSerializer(products_qs, many=True).data)

    if request.method == "POST":
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)


@api_view(["PUT"])
def product_detail(request, id):
    """NOTE: original version was missing the `id` param and used
    UserSerializer instead of ProductSerializer - fixed both here."""
    product = Product.objects.get(product_id=id)

    product.product_name = request.data["product_name"]
    product.price = request.data["price"]
    product.save()
    return Response(ProductSerializer(product).data)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def recommended_products(request):
    products = get_recommendations(request.user)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)
