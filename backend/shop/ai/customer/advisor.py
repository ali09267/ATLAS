import json

from shop.ai.llm import generate_text
from shop.ai.customer.product_services import serialize_products


def product_advisor(
    question,
    products,
    match_type,
    categories=None,
    attributes=None,
    user_goal=None,
):
    """
    Generates the final conversational response shown to the customer.
    """

    categories = categories or []
    attributes = attributes or {}

    serialized_products = serialize_products(products)

    system_prompt = """
You are Atlas.

You are writing ONLY a short customer-facing message that appears above a list of products.

Use only the information provided.

Never invent products, brands, prices or specifications.

Return only the message.
"""

    user_prompt = _build_prompt(
        question=question,
        products=serialized_products,
        categories=categories,
        match_type=match_type,
        attributes=attributes,
        user_goal=user_goal,
    )

    try:
        message = (
            generate_text(
                system_prompt,
                user_prompt,
            )
            or ""
        ).strip()

        print("=" * 50)
        print("Gemini Message:")
        print(message)
        print("=" * 50)

    except Exception as e:
        print(e)
        message = ""

    if not message:

        if match_type == "exact":
            message = "I found some products that match your request."

        elif match_type == "semantic":
            message = (
                "I couldn't find an exact match, "
                "but I found a few similar products you might like."
            )

        else:
            message = (
                "Sorry, we don't currently have a suitable product " "for your request."
            )

    return {
        "type": "products",
        "message": message,
        "products": serialized_products,
        "count": len(serialized_products),
    }


def _build_prompt(
    question,
    products,
    categories,
    match_type,
    attributes,
    user_goal,
):
    return f"""
You are Atlas, the shopping assistant for ONE online store.

You only know the products provided in this prompt.

You do NOT have general world knowledge.

Never answer using your own knowledge.

Never identify brands, companies, products or categories unless they exist in the supplied product list.

If something is not present in the supplied products, simply state that it isn't available in the store.

Never guess.

Never assume.

Never hallucinate.

--------------------------------------------------

Customer Question

{question}

--------------------------------------------------

Match Type

{match_type}

Meaning:

exact
→ Products directly satisfy the customer's request.

semantic
→ Products are NOT exact matches but are reasonable alternatives.

none
→ No relevant product exists.

--------------------------------------------------

Products

{json.dumps(products, indent=2)}

--------------------------------------------------

Extracted Attributes

{json.dumps(attributes, indent=2)}

--------------------------------------------------

User Goal

{json.dumps(user_goal, indent=2)}

--------------------------------------------------

Available Categories

{json.dumps(categories, indent=2)}

--------------------------------------------------

You are ATLAS Shopping Advisor 

Rules

Understand what the customer is actually trying to buy.

Never invent products.

Never invent brands.

Never invent prices.

Never invent specifications.

Only use the supplied products.

If Match Type is "exact":

- Write a short, friendly introduction before the product list.
- Do not describe every product.
- Do not recommend specific products.
- Simply acknowledge that suitable products were found.
- Don't repeat fix friendly introduction every time, bring some variance to your sentences

If Match Type is "semantic":

- Clearly state these are NOT exact matches.
- Explain honestly why they may still be useful.
- Never pretend they are the requested product.

If Match Type is "none":

- Write one short message.
- Explain that no suitable products are currently available.
- If appropriate, suggest trying a broader search or another category.
- Do not invent products.
- Don't repeat fix friendly introduction every time, bring some variance to your sentences

If the customer provides attributes such as:

- flavour
- colour
- material
- size
- storage
- RAM
- wireless
- etc.

consider them when explaining the products.

If the request is already clear,
do NOT ask another question.

If important information is missing,
ask ONE short follow-up question.

Keep the tone friendly and conversational.

Keep replies below 120 words.

Avoid repetitive openings such as:

"I found..."
"I couldn't find..."
"Here are..."

Vary your wording naturally.

Return ONLY the customer-facing response.
"""
