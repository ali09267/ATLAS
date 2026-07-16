from rest_framework import serializers
from .models import Product
from .models import CustomUser
from .models import Order
from .models import OrderItem
from .models import Notification
from .models import DeviceToken


class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["product_id", "product_name", "category", "price", "desc", "image"]

    def get_image(self, obj):
        if obj.image:
            return f"http://127.0.0.1:8000/media/{obj.image}"
        return ""


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.product_name")

    class Meta:
        model = OrderItem
        fields = ["product_name", "quantity"]


class OrderSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ["id", "user_name", "status", "created_at", "items"]

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()


class NotificationSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            "id",
            "order",
            "customer_name",
            "title",
            "message",
            "is_read",
            "created_at",
        ]

    def get_customer_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()


class DeviceTokenSerializer(serializers.ModelSerializer):

    class Meta:

        model = DeviceToken

        fields = "__all__"
