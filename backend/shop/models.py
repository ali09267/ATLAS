from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# Create your models here.


class Product(models.Model):

    product_id = models.AutoField(primary_key=True)
    product_name = models.CharField(max_length=120)
    brand = models.CharField(max_length=50, default="")
    category = models.CharField(max_length=50, default="")
    price = models.IntegerField(default=0)
    desc = models.TextField()
    specifications = models.JSONField(default=dict)
    image = models.ImageField(upload_to="shop/images", default="")


class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    desc = models.CharField(max_length=600)

    def __str__(self):
        return self.name


class CustomUser(AbstractUser):

    class Roles(models.TextChoices):
        ADMIN = "admin", "Admin"
        CUSTOMER = "customer", "Customer"

    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=Roles.CUSTOMER,
    )

    def __str__(self):
        full_name = f"{self.first_name} {self.last_name}".strip()

        if full_name:
            return full_name

        return self.email or self.username


class Order(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("SHIPPED", "Shipped"),
        ("DELIVERED", "Delivered"),
        ("CANCELLED", "Cancelled"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders"
    )

    total_price = models.IntegerField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"


class OrderItem(models.Model):

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")

    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    quantity = models.IntegerField(default=1)

    price = models.IntegerField()

    def __str__(self):
        return f"{self.product.product_name} x {self.quantity}"


class ProductView(models.Model):

    user = models.ForeignKey(  # what user
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE
    )

    product = models.ForeignKey(  # what product he viewed
        Product, on_delete=models.CASCADE
    )
    view_count = models.IntegerField(default=1)  # how many times he viewed that product
    viewed_at = models.DateTimeField(auto_now_add=True)  # time he viewed that product

    def __str__(self):
        return f"{self.user.email} viewed {self.product.product_name}"  # refer user by name and product name


class Notification(models.Model):  # CREATE TABLE Notification

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications"
    )

    order = models.ForeignKey(
        "Order",
        on_delete=models.CASCADE,
        related_name="notifications",
        null=True,
        blank=True,
    )

    title = models.CharField(max_length=150)

    message = models.TextField()

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.first_name} - {self.title}"


class DeviceToken(models.Model):
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="device_tokens",
    )

    token = models.TextField(unique=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.user:
            return f"{self.user.first_name} - Device"
        return f"Unassigned Device - {self.token[:10]}"


from django.db import models


class ContactMessage(models.Model):
    STATUS_CHOICES = [
        ("NEW", "New"),
        ("READ", "Read"),
        ("RESOLVED", "Resolved"),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="NEW",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email}"


# container that hold messages of particular user like messages of ali, messages of ali2 etc.
class SupportConversation(models.Model):
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="support_conversation",
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ("OPEN", "Open"),
            ("CLOSED", "Closed"),
        ],
        default="OPEN",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Support Chat - {self.user.username}"


# individual text messages
class SupportMessage(models.Model):
    conversation = models.ForeignKey(  # belongs to which chat
        SupportConversation,
        on_delete=models.CASCADE,
        related_name="messages",
    )

    sender = models.ForeignKey(  # who is sender (customer or admin)
        CustomUser,
        on_delete=models.CASCADE,
        related_name="support_messages",
    )

    message = models.TextField()  # actual msg

    created_at = models.DateTimeField(auto_now_add=True)

    read_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.sender.username}: {self.message[:30]}"
