from shop.ai.events import AIIntents
from shop.ai.customer.product_services import search_products, get_all_categories
from shop.ai.customer.order_services import (
    all_orders,
    latest_order,
    orders_between_dates,
    orders_by_status,
    purchased_products,
    has_purchased_product,
    total_orders as customer_total_orders,
)
from shop.ai.customer.browsing_services import (
    recently_viewed_products,
    last_viewed_product,
)
from shop.services.analytics import (
    total_categories,
    total_customers,
    top_selling_product,
    orders_between_dates,
    total_orders as admin_total_orders,
    total_products,
    total_revenue,
)
from shop.ai.customer.chat_service import general_chat
from shop.ai.customer.advisor import product_advisor
from shop.ai.customer.retrieval import retrieve_products


def dispatch(intent, parameters, user, question):

    product = parameters.get("product", {})
    keyword = product.get("name")

    if intent == AIIntents.TOTAL_CUSTOMERS:
        return total_customers()
    elif intent == AIIntents.TOTAL_PRODUCTS:
        return total_products()
    elif intent == AIIntents.TOTAL_CATEGORIES:
        return total_categories()
    elif intent == AIIntents.TOTAL_ORDERS:

        if user.role == "admin":
            return admin_total_orders()

        return customer_total_orders(user)
    elif intent == AIIntents.TOTAL_REVENUE:
        return total_revenue()
    elif intent == AIIntents.TOP_SELLING_PRODUCT:
        return top_selling_product()
    elif intent == AIIntents.ORDERS_BETWEEN_DATES:
        return orders_between_dates(parameters["start_date"], parameters["end_date"])
    elif intent == AIIntents.SEARCH_PRODUCTS:

        retrieval = retrieve_products(
            question=question,
            parameters=parameters,
        )

        return product_advisor(
            question=question,
            products=retrieval["products"],
            match_type=retrieval["match_type"],
            categories=get_all_categories(),
            attributes=retrieval["attributes"],
            user_goal=retrieval["user_goal"],
        )

    elif intent == AIIntents.MY_ORDERS:
        return all_orders(user)

    elif intent == AIIntents.LATEST_ORDER:
        return latest_order(user)

    elif intent == AIIntents.ORDERS_BY_STATUS:
        return orders_by_status(user)

    elif intent == AIIntents.PURCHASED_PRODUCTS:
        return purchased_products(user)

    elif intent == AIIntents.HAS_PURCHASED_PRODUCT:
        return has_purchased_product(user, keyword)

    elif intent == AIIntents.RECENTLY_VIEWED_PRODUCTS:
        return recently_viewed_products(user)

    elif intent == AIIntents.LAST_VIEWED_PRODUCT:
        return last_viewed_product(user)

    elif intent == AIIntents.GENERAL_CHATS:
        print("🔥 GENERAL CHAT CONDITION MATCHED")
        return general_chat(question)
    else:
        return "Intent not recognized"
