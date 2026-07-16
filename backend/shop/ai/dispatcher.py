from shop.ai.events import AIIntents
from shop.ai.customer.product_services import search_products

from shop.services.analytics import (
    total_categories,
    total_customers,
    top_selling_product,
    orders_between_dates,
    total_orders,
    total_products,
    total_revenue,
)


def dispatch(intent, parameters, user):

    if intent == AIIntents.TOTAL_CUSTOMERS:
        return total_customers()
    elif intent == AIIntents.TOTAL_PRODUCTS:
        return total_products()
    elif intent == AIIntents.TOTAL_CATEGORIES:
        return total_categories()
    elif intent == AIIntents.TOTAL_ORDERS:
        return total_orders()
    elif intent == AIIntents.TOTAL_REVENUE:
        return total_revenue()
    elif intent == AIIntents.TOP_SELLING_PRODUCT:
        return top_selling_product()
    elif intent == AIIntents.ORDERS_BETWEEN_DATES:
        return orders_between_dates(parameters["start_date"], parameters["end_date"])
    elif intent == AIIntents.SEARCH_PRODUCTS:
        return search_products(
            keyword=parameters.get("keyword"),
            category=parameters.get("category"),
            min_price=parameters.get("min_price"),
            max_price=parameters.get("max_price"),
        )
    else:
        return "Intent not recognized"
