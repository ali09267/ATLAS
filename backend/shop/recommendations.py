from .models import ProductView, OrderItem
from .models import Product
from django.db.models import Sum, Count


def get_product_scores(user):
    """
    Returns a dictionary:
    {
        product_id: score
    }

    View = +1
    Purchase = +5
    """

    product_scores = {}

    # -----------------------
    # Views
    # -----------------------
    views = ProductView.objects.filter(
        user=user
    )  # filter records based on current logged in user

    # laptop 1
    # laptop 1
    # laptop 1
    # PC 1
    # Charger 1
    # Charger 1

    for view in views:

        product_id = view.product.product_id  # laptop id

        product_scores[product_id] = (  # score of laptop
            product_scores.get(product_id, 0)
            + 1  # get the score of prev laptop and add 1 if no prev laptop score means never viewed hence consider 0
        )

    # -----------------------
    # Purchases
    # -----------------------
    purchases = OrderItem.objects.filter(order__user=user)

    for item in purchases:

        product_id = item.product.product_id

        product_scores[product_id] = (
            product_scores.get(product_id, 0)
            + 5
            * item.quantity  # increment score by +5 if user successfully purchased that product (if bought that product multiple times than increase score propotionally)
        )

    return product_scores


def get_category_scores(product_scores):
    """
    Converts product scores into category scores.

    Example input:
    {
        15: 12,
        20: 1,
        33: 5
    }

    Example output:
    {
        "Electronics": 18
    }
    """

    category_scores = {}

    # Get all required products in ONE query(avoid unnecessary running of  queries)
    products = Product.objects.filter(product_id__in=product_scores.keys())

    # Create lookup dictionary for avoiding n+1 query problem
    product_lookup = {product.product_id: product for product in products}

    for product_id, score in product_scores.items():

        product = product_lookup.get(product_id)  # find each product in lookup

        if not product:  # if not present then skip this iteration
            continue

        category = product.category  # else grab its category

        category_scores[category] = (
            category_scores.get(category, 0) + score  # increase its score
        )
        return category_scores


def get_purchased_products(user):
    """
    Returns a set containing IDs of products
    the user has already purchased.

    Example:
    {3, 8, 15, 27}
    """

    purchased_ids = (
        set()
    )  # use a hash table to optimize time complexity to O(1) instead of lists which means searching is   O(N)

    purchases = OrderItem.objects.filter(order__user=user)

    for item in purchases:
        purchased_ids.add(item.product.product_id)

    return purchased_ids


def get_category_recommendations(category_scores, purchased_ids, limit=20):
    """
    Recommend products from the user's favourite categories.

    Parameters
    ----------
    category_scores : dict
        Example:
        {
            "Electronics": 18,
            "Books": 7
        }

    purchased_ids : set
        Product IDs already bought.

    limit : int
        Maximum recommendations.
    """

    recommendations = []

    added_ids = set()  # so no duplicate products

    # Highest scoring categories first
    sorted_categories = sorted(
        category_scores.items(), key=lambda item: item[1], reverse=True
    )

    for category, score in sorted_categories:

        remaining = limit - len(recommendations)  # not more than 50 recommendations

        products = Product.objects.filter(category=category)[
            :remaining
        ]  # only fetch not more than top 50

        for product in products:

            # Don't recommend purchased products
            if product.product_id in purchased_ids:
                continue

            # Don't recommend duplicates
            if product.product_id in added_ids:
                continue

            recommendations.append(
                product
            )  # in neither purchased nor added in recommendation then add in recommendation

            added_ids.add(
                product.product_id
            )  # track its storage so cannot be insert twice

            if len(recommendations) >= limit:
                return recommendations  # yeah yeah

    return recommendations


# ----------------------------------------------------
# STEP 5
# Most Sold
# ----------------------------------------------------
def get_most_sold_products(limit=20):

    return Product.objects.annotate(total_sold=Sum("orderitem__quantity")).order_by(
        "-total_sold"
    )[:limit]


# ----------------------------------------------------
# STEP 6
# Latest Products
# ----------------------------------------------------
def get_latest_products(limit=20):

    return Product.objects.order_by("-product_id")[:limit]


# ----------------------------------------------------
# FINAL
# Recommendation Engine
# ----------------------------------------------------
def get_recommendations(user, limit=20):

    # -----------------------------------
    # User Behaviour
    # -----------------------------------
    product_scores = get_product_scores(user)

    # Cold Start
    if not product_scores:

        recommendations = list(get_most_sold_products(limit))

        if len(recommendations) < limit:

            existing = {p.product_id for p in recommendations}

            latest = get_latest_products(limit)

            for product in latest:

                if product.product_id not in existing:

                    recommendations.append(product)
                    existing.add(product.product_id)

                if len(recommendations) >= limit:
                    break

        return recommendations

    # -----------------------------------
    # Personalized Recommendation
    # -----------------------------------
    category_scores = get_category_scores(product_scores)

    purchased_ids = get_purchased_products(user)

    recommendations = get_category_recommendations(
        category_scores,
        purchased_ids,
        limit,
    )

    # -----------------------------------
    # Fill with Most Sold
    # -----------------------------------
    existing = {p.product_id for p in recommendations}

    most_sold = get_most_sold_products(limit)

    for product in most_sold:

        if product.product_id in existing:
            continue

        if product.product_id in purchased_ids:
            continue

        recommendations.append(product)
        existing.add(product.product_id)

        if len(recommendations) >= limit:
            return recommendations

    # -----------------------------------
    # Fill with Latest
    # -----------------------------------
    latest = get_latest_products(limit)

    for product in latest:

        if product.product_id in existing:
            continue

        if product.product_id in purchased_ids:
            continue

        recommendations.append(product)
        existing.add(product.product_id)

        if len(recommendations) >= limit:
            break

    return recommendations
