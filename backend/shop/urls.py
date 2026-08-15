from django.urls import path

from django.conf import settings
from django.conf.urls.static import static

from shop.views.ai_views import ai_query
from shop.views.analytical_view import analytics_test, top_selling_product_view

from . import views
from .views.auth_views import register, login_view, user_logout, check_auth
from .views.customer_views import get_customers, customer_detail
from .views.product_views import (
    api_product_detail,
    get_products,
    product_detail,
    products,
    recommended_products,
    search_products,
    get_all_products,
)
from .views.page_views import index, contact, csrf_token
from .views.notification_views import (
    NotificationListView,
    save_device_token,
    track_view,
)
from .views.order_views import (
    get_orders,
    update_order_status,
    create_order,
    latest_order,
)

# map of our project, which path to follow for which view with optional name parameter
# path("actual path/url/link","view.function_name",name="optional_name")
urlpatterns = [
    path("api/products/", get_products),
    path("", index, name="shopHome"),
    path("products/<int:myid>/", products, name="products"),
    path("api/products/<int:myid>/", api_product_detail, name="apiProductDetail"),
    path("api/register/", register),
    path("api/logout/", user_logout),
    path("api/check-auth/", check_auth),
    path("api/create-order/", create_order, name="create_order"),
    path("api/track-view/", track_view, name="track_view"),
    path("api/recommendations/", recommended_products),
    path("api/search/", search_products),  # for search/filter products
    path("api/login/", login_view),
    path("api/orders/", get_orders),
    path("api/customers/", get_customers),
    path("api/customers/<int:id>/", customer_detail),
    path("api/edit_products/<int:id>/", product_detail),
    path("notifications/", NotificationListView.as_view(), name="notifications"),
    path(
        "api/orders/<int:id>/status/",
        update_order_status,
    ),
    path("api/device-token/", save_device_token),
    path("api/analytics/test/", analytics_test),
    path("api/analytics/top-selling-product/", top_selling_product_view),
    path(
        "api/ai-query/",
        ai_query,
    ),
    path("api/products/all/", get_all_products, name="get_all_products"),
    path("api/orders/latest/", latest_order),
    path("api/contact-us/", contact, name="contact-us"),
    path("api/csrf/", csrf_token, name="csrf_token"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
