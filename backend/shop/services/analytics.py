# file which contains the analytics services for the shop app such as
# total customers, total revenue, products analytics etc.

from django.db.models import Sum

from shop.ai.response_formatter import (
    metric,
    table,
)

from shop.models import (
    Product,
    Order,
    OrderItem,
    CustomUser,
)

from shop.ai.date_utils import normalize_date


def total_customers():

    result = CustomUser.objects.count()

    return metric(
        title="Total Customers",
        value=result,
    )


def total_products():

    result = Product.objects.count()

    return metric(
        title="Total Products",
        value=result,
    )


def total_categories():

    result = Product.objects.values("category").distinct().count()

    return metric(
        title="Total Categories",
        value=result,
    )


def total_orders():

    result = Order.objects.count()

    return metric(
        title="Total Orders",
        value=result,
    )


def total_revenue():

    result = Order.objects.aggregate(total_revenue=Sum("total_price"))["total_revenue"]

    return metric(
        title="Total Revenue",
        value=result,
    )


def top_selling_product():

    products = (
        OrderItem.objects.values("product__product_name")
        .annotate(total_sold=Sum("quantity"))
        .order_by("-total_sold")
    )

    rows = []

    for product in products:

        rows.append(
            [
                product["product__product_name"],
                product["total_sold"],
            ]
        )

    return table(
        title="Top Selling Products",
        columns=[
            "Product",
            "Units Sold",
        ],
        rows=rows,
    )


def products_under_price(price):

    products = Product.objects.filter(price__lt=price)

    rows = []

    for product in products:

        rows.append(
            [
                product.product_name,
                product.price,
            ]
        )

    return table(
        title=f"Products Under {price}",
        columns=[
            "Product",
            "Price",
        ],
        rows=rows,
    )


def products_under_category(category):

    products = Product.objects.filter(category=category)

    rows = []

    for product in products:

        rows.append(
            [
                product.product_name,
                product.price,
            ]
        )

    return table(
        title=f"Products in '{category}' Category",
        columns=[
            "Product",
            "Price",
        ],
        rows=rows,
    )


def orders_between_dates(start_date, end_date):

    start_date = normalize_date(start_date)
    end_date = normalize_date(end_date)

    orders = Order.objects.filter(created_at__date__range=[start_date, end_date])

    rows = []

    for order in orders:
        rows.append(
            [
                order.id,
                order.user.first_name,
                order.total_price,
                order.status,
                order.created_at.strftime("%d-%m-%Y"),
            ]
        )

    return table(
        title=f"Orders from {start_date} to {end_date}",
        columns=[
            "Order ID",
            "Customer",
            "Total Price",
            "Status",
            "Date",
        ],
        rows=rows,
    )
