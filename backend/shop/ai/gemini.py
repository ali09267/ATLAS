import google.generativeai as genai
import json

from django.conf import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


def classify_question(question, user_role):

    prompt = f"""
You are an AI assistant for an e-commerce application.

Current user's role:

customer

or

Current user's role:

admin

depending on

user_role

So:

Current user's role:

{{user_role}}

Do not answer the user's question.

Only classify the user's request into one of the allowed intents and extract the required parameters.

Allowed intents:

1. total_customers
2. total_revenue
3. total_orders
4. total_products
5. total_categories
6. least_selling_product
7. top_selling_product
8. most_active_customer
9. search_products
10. orders_between_dates

Return ONLY valid JSON.

Always return exactly this structure:

{{
    "intent": "<intent_name>",
    "parameters": {{}}
}}

If the question contains parameters, include them inside the "parameters" object.

Examples:

Question:
How many customers are there?

Response:
{{
    "intent": "total_customers",
    "parameters": {{}}
}}

Question:
What is the total revenue?

Response:
{{
    "intent": "total_revenue",
    "parameters": {{}}
}}

Question:
Show products under 5000

Response:
{{
    "intent":"search_products",
    "parameters":{{
        "max_price":5000
    }}
}}

Question:
Show products in electronics category

Response:
{{

    "intent":"search_products",
    "parameters":{{
        "category":"electronics"
        }}
}}

Question:
Show orders in the last month

Response:
{{
    "intent": "orders_between_dates",
    "parameters": {{
        "start_date": "2023-01-01",
        "end_date": "2023-01-31"
    }}
}}

Question:

{question}
"""
    # model reps gemini 2.5-flash and generate_content reps the function to generate content from the model using the prompt(admin' Qs) provided
    response = model.generate_content(prompt)
    cleaned_response = (
        response.text.strip()
    )  # remove trailing and leading whitespace from the response text

    if cleaned_response.startswith("```json"):
        cleaned_response = cleaned_response.replace("```json", "", 1)

    if cleaned_response.endswith("```"):
        cleaned_response = cleaned_response[:-3]

    cleaned_response = cleaned_response.strip()

    return json.loads(cleaned_response)
