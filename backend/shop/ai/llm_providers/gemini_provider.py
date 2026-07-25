import google.generativeai as genai
from django.conf import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate(system_prompt, user_prompt):
    """
    Generate a response using Gemini.
    Raises any exception to the caller.
    """

    response = model.generate_content([system_prompt, user_prompt])

    return response.text.strip()
