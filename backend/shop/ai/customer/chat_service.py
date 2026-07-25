from shop.ai.response_formatter import chat
from shop.ai.llm_providers.gemini_provider import generate as generate_gemini
from shop.ai.llm_providers.groq_provider import generate as generate_groq


def general_chat(question):

    system_prompt = """
You are Atlas AI, an intelligent shopping assistant.

Answer naturally and conversationally.

Keep answers concise and helpful.

Do not return JSON.
"""

    try:

        response = generate_gemini(
            system_prompt,
            question,
        )

    except Exception as gemini_error:

        print(f"Gemini failed: {gemini_error}")
        print("Switching to Groq...")

        response = generate_groq(
            system_prompt,
            question,
        )

    return chat(response)
