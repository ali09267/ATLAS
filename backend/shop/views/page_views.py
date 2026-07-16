from math import ceil

from django.http import HttpResponse
from django.shortcuts import render

from ..models import Product


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


def contact(request):
    if request.method == "POST":
        name = request.POST.get("name", "")
        email = request.POST.get("email", "")
        phone = request.POST.get("phone", "")
        desc = request.POST.get("desc", "")

    return render(request, "shop/contact.html")


def product_detail_page(request, myid):
    """Renders the single-product page. (Renamed from `products` - that name
    was being shadowed by the DRF `products` view defined later in the
    original file.)"""
    product = Product.objects.get(id=myid)
    return render(request, "shop/product.html", {"product": product})


def search(request):
    return HttpResponse("search view")


def tracker(request):
    return render(request, "shop/tracker.html")


def checkout(request):
    return render(request, "shop/checkout.html")
