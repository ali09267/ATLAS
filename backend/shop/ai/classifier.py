from shop.models import Product

from shop.ai.system_message import build_system_prompt
from shop.ai.llm import generate_json


def classify_question(question, user_role):

    categories = sorted(
        Product.objects.values_list(
            "category",
            flat=True,
        ).distinct()
    )

    categories_text = "\n".join(f"- {category}" for category in categories)

    system_prompt = build_system_prompt(
        user_role,
        categories_text,
    )

    try:

        return generate_json(
            system_prompt,
            question,
        )

    except Exception as e:

        print("\nClassifier Error")
        print(e)

        return {
            "intent": "general_chat",
            "parameters": {},
        }
