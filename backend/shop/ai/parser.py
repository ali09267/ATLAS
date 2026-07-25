import json
import re


def clean_response(response: str) -> str:
    """
    Removes markdown code fences and trims whitespace.
    """

    if not response:
        return ""

    response = response.strip()

    # Remove ```json
    response = re.sub(r"^```json", "", response, flags=re.IGNORECASE)

    # Remove ```
    response = re.sub(r"```$", "", response)

    return response.strip()


def parse_json(response: str):
    """
    Safely converts an LLM response into Python JSON.
    """

    response = clean_response(response)

    try:
        return json.loads(response)

    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON returned by LLM:\n{response}") from e
