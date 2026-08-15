from math import ceil

from django.shortcuts import render

from ..models import Product, ContactMessage, Notification, CustomUser
from ..serializers import ContactMessageSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
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


@api_view(["POST"])
def contact(request):
    serializer = ContactMessageSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    contact_message = serializer.save()

    # Get all admin users
    admins = CustomUser.objects.filter(role="admin")
    print("ADMINS:", admins)
    print("ADMIN COUNT:", admins.count())

    for admin in admins:

        print("CREATING NOTIFICATION FOR:", admin)
        Notification.objects.create(
            user=admin,  # first name, last name, email
            message=(
                f"New contact message from "
                f"{contact_message.first_name} "
                f"{contact_message.last_name}"
            ),
        )

    return Response(
        {
            "success": True,
            "message": "Your message has been sent successfully.",
            "contact_id": contact_message.id,
        },
        status=status.HTTP_201_CREATED,
    )


def product_detail_page(request, myid):
    """Renders the single-product page. (Renamed from `products` - that name
    was being shadowed by the DRF `products` view defined later in the
    original file.)"""
    product = Product.objects.get(id=myid)
    return render(request, "shop/product.html", {"product": product})
