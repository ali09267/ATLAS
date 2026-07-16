from .models import Product, ProductView
from django.db.models import Count


def get_user_interest(user):
    
    # Step 1: get all viewed products
    views = ProductView.objects.filter(user=user)

    # Step 2: count how many times each category was viewed
    category_scores = {}

    for view in views:
        category = view.product.category

        if category in category_scores:
            category_scores[category] += 1
        else:
            category_scores[category] = 1

    return category_scores

def get_recommendations(user):

    category_scores = get_user_interest(user)

    # sort categories by interest (highest first)
    sorted_categories = sorted(
        category_scores.items(),
        key=lambda x: x[1],
        reverse=True
    )

    recommended_products = []

    for category, score in sorted_categories:

        products = Product.objects.filter(category=category)[:10]

        for p in products:
            recommended_products.append(p)

    return recommended_products[:20]