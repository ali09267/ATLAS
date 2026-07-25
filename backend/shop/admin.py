from django.contrib import admin

# Register your models here.
from .models import Product
from .models import CustomUser
from .models import Order, OrderItem
from .models import ProductView
from .models import DeviceToken
from .models import Notification

admin.site.register(Product)
admin.site.register(CustomUser)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ProductView)
admin.site.register(DeviceToken)
admin.site.register(Notification)
