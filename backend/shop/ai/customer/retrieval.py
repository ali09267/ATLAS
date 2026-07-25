from shop.ai.customer.product_services import (
    search_products,
    broad_candidate_search,
)
from shop.ai.customer.retrieval_engine import semantic_search


def retrieve_products(question, parameters):
    """
    Product Retrieval Pipeline

    Flow:
    1. Exact Search
    2. Broad Candidate Search
    3. Semantic Search
    """

    parameters = parameters or {}

    # ---------------- Product ----------------

    product = parameters.get("product", {}) or {}

    product_name = product.get("name")
    category = product.get("category")
    brand = product.get("brand")

    # ---------------- Filters ----------------

    filters = parameters.get("filters", {}) or {}
    price = filters.get("price", {}) or {}

    min_price = price.get("min")
    max_price = price.get("max")

    # ---------------- Attributes ----------------

    attributes = parameters.get("attributes", {}) or {}

    # ---------------- User Goal ----------------

    user_goal = parameters.get("user_goal")

    print("\n========== RETRIEVAL ==========")
    print("Product     :", product_name)
    print("Category    :", category)
    print("Brand       :", brand)
    print("Attributes  :", attributes)
    print("User Goal   :", user_goal)
    print("Min Price   :", min_price)
    print("Max Price   :", max_price)
    print("================================")

    # ==========================================================
    # STEP 1 : Exact Search
    # ==========================================================

    exact_products = search_products(
        keyword=product_name,
        category=category,
        brand=brand,
        min_price=min_price,
        max_price=max_price,
    )

    if exact_products.exists():

        print("✓ Exact products found.")

        return {
            "products": exact_products,
            "match_type": "exact",
            "attributes": attributes,
            "user_goal": user_goal,
        }

    print("✗ No exact products found.")

    # ==========================================================
    # STEP 2 : Broad Candidate Search
    # ==========================================================

    candidates = broad_candidate_search(
        keyword=product_name,
        category=category,
        brand=brand,
    )

    if not candidates.exists():

        print("✗ No candidate products found.")

        return {
            "products": candidates,
            "match_type": "none",
            "attributes": attributes,
            "user_goal": user_goal,
        }

    print(f"✓ {candidates.count()} candidate products collected.")

    # ==========================================================
    # STEP 3 : Semantic Search
    # ==========================================================

    semantic_products = semantic_search(
        question=question,
        parameters=parameters,
        candidates=candidates,
    )

    if semantic_products.exists():

        print(f"✓ {semantic_products.count()} semantic alternatives selected.")

        return {
            "products": semantic_products,
            "match_type": "semantic",
            "attributes": attributes,
            "user_goal": user_goal,
        }

    print("✗ No semantic alternatives found.")

    return {
        "products": semantic_products,
        "match_type": "none",
        "attributes": attributes,
        "user_goal": user_goal,
    }
