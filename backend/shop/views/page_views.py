from math import ceil

from django.shortcuts import render

from ..models import Product
from django.middleware.csrf import get_token
from django.http import JsonResponse


def index(request):
    allProducts = []
    category_products = Product.objects.values("category", "product_id")
    categorys = {item["category"] for item in category_products}

    for category in categorys:
        category_products = Product.objects.filter(category=category)
        n = len(category_products)
        nSlides = ceil(n / 4)
        slides = []
        for i in range(nSlides):
            slides.append(category_products[i * 4 : (i * 4) + 4])
        allProducts.append([category, slides, range(nSlides)])

    return render(request, "shop/index.html", {"allProducts": allProducts})


def about(request):
    return render(request, "shop/about.html")


def csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})


def product_detail_page(request, myid):
    """Renders the single-product page. (Renamed from `products` - that name
    was being shadowed by the DRF `products` view defined later in the
    original file.)"""
    product = Product.objects.get(id=myid)
    return render(request, "shop/product.html", {"product": product})
