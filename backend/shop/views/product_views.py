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
from shop.pagination import StandardPagination


@api_view(["GET"])
def get_products(request):

    search = request.GET.get("search", "").strip()  # what user searches in  search bar
    products = Product.objects.all().order_by("product_id")  # fetch all products

    if search:  # if user types anything (search bar is not empty)
        products = products.filter(  # filter those products
            Q(
                product_name__icontains=search
            )  # whose name matches the search(what user types is included in product name)
            | Q(category__icontains=search)  # or category matches the search
        )

    paginator = StandardPagination()  # instantiate Product Pagination class
    page = paginator.paginate_queryset(
        products, request
    )  # send products (all products) and request(either prev button, next button, page number etc.)
    serializer = ProductSerializer(page, many=True)  # serialize just curr page

    return paginator.get_paginated_response(serializer.data)


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


@api_view(["PUT", "DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def product_detail(request, id):

    try:
        product = Product.objects.get(product_id=id)

    except Product.DoesNotExist:
        return Response(
            {"error": "Product not found"},
            status=404,
        )

    # =========================
    # UPDATE PRODUCT
    # =========================

    if request.method == "PUT":

        product.product_name = request.data.get(
            "product_name",
            product.product_name,
        )

        product.price = request.data.get(
            "price",
            product.price,
        )

        product.save()

        return Response(
            ProductSerializer(product).data,
            status=200,
        )

    # =========================
    # DELETE PRODUCT
    # =========================

    if request.method == "DELETE":

        product.delete()

        return Response(
            {"message": "Product deleted successfully"},
            status=200,
        )


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def recommended_products(request):
    products = get_recommendations(request.user)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_all_products(request):
    products = Product.objects.all().order_by("product_id")

    serializer = ProductSerializer(products, many=True)

    return Response(serializer.data)
