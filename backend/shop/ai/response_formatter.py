from shop.serializers import ProductSerializer
from shop.serializers import OrderSerializer, OrderItemSerializer


def metric(title, value):  # total customers, 25

    return {"type": "metric", "title": title, "value": value}


def table(title, columns, rows):  # products, name | price , laptop 23

    return {"type": "table", "title": title, "columns": columns, "rows": rows}


def list_response(title, items):

    return {"type": "list", "title": title, "items": items}


def chart(title, chart_type, labels, values):

    return {
        "type": "chart",
        "chart_type": chart_type,
        "title": title,
        "labels": labels,
        "values": values,
    }


def format_products(products):
    serializer = ProductSerializer(products, many=True)

    return {
        "type": "products",
        "products": serializer.data,
    }


def format_orders(orders):
    serializer = OrderSerializer(orders, many=True)

    return {
        "type": "orders",
        "orders": serializer.data,
    }
