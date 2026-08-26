from groq import Groq
from django.conf import settings

client = Groq(api_key=settings.GROQ_API_KEY)


def generate(system_prompt, user_prompt):
    """
    Generate a response using Groq.
    Raises any exception to the caller.
    """

    completion = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
        temperature=0,
    )

    print("\n========== GROQ RAW RESPONSE ==========")
    print(completion.choices[0].message.content)
    print("=======================================\n")

    return completion.choices[0].message.content.strip()
