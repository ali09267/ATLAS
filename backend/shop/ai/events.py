# defining all the intents (what does user actually mean) and just map them into variable names instead of strings to avoid typos and make it easier to change the intent names in the future if needed. This is a good practice to keep the code clean and maintainable.


class AIIntents:

    TOTAL_CUSTOMERS = "total_customers"  # done
    TOTAL_PRODUCTS = "total_products"

    TOTAL_CATEGORIES = "total_categories"

    TOTAL_ORDERS = "total_orders"

    TOP_SELLING_PRODUCT = "top_selling_product"

    TOTAL_REVENUE = "total_revenue"

    MOST_ACTIVE_CUSTOMER = "most_active_customer"

    LEAST_SELLING_PRODUCT = "least_selling_product"

    SEARCH_PRODUCTS = "search_products"

    ORDERS_BETWEEN_DATES = "orders_between_dates"
