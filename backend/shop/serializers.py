from rest_framework import serializers
from .models import Product
from .models import CustomUser
from .models import Order
from .models import OrderItem
from .models import Notification
from .models import DeviceToken
from .models import ContactMessage
from .models import SupportMessage


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

    product_name = serializers.CharField(source="product.product_name", read_only=True)

    image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product_name",
            "image",
            "quantity",
            "price",
        ]

    def get_image(self, obj):
        if obj.product.image:
            return f"http://127.0.0.1:8000/media/{obj.product.image}"
        return ""


class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "customer_name",
            "status",
            "created_at",
            "total_price",
            "items",
        ]

    def get_customer_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


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


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "message",
            "status",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "status",
            "created_at",
        ]


class SupportMessageSerializer(serializers.ModelSerializer):

    sender_name = serializers.SerializerMethodField()
    sender_role = serializers.CharField(
        source="sender.role",
        read_only=True,
    )

    class Meta:
        model = SupportMessage
        fields = [
            "id",
            "message",
            "sender_name",
            "sender_role",
            "created_at",
            "read_at",
        ]

    def get_sender_name(self, obj):
        return f"{obj.sender.first_name} {obj.sender.last_name}".strip()
