import json

from shop.ai.llm_providers.gemini_provider import generate as gemini_generate
from shop.ai.llm_providers.groq_provider import generate as groq_generate

from shop.ai.parser import parse_json


def generate_text(system_prompt, user_prompt):
    """
    Generates a plain text response.
    Uses provider fallback automatically.
    """

    providers = [
        ("Gemini", gemini_generate),
        ("Groq", groq_generate),
    ]

    last_error = None

    for provider_name, provider in providers:

        try:

            print(f"Trying {provider_name}...")

            return provider(
                system_prompt,
                user_prompt,
            )

        except Exception as e:

            last_error = e

            print(f"{provider_name} failed:")
            print(e)

    raise Exception(f"All AI providers failed.\nLast Error:\n{last_error}")


def generate_json(system_prompt, user_prompt):
    """
    Generates structured JSON.
    """

    response = generate_text(
        system_prompt,
        user_prompt,
    )

    return parse_json(response)
