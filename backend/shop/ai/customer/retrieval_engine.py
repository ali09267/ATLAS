from shop.models import Product

from shop.ai.candidate import build_candidate_prompt
from shop.ai.llm import generate_json


def semantic_search(question, parameters, candidates):
    """
    Performs semantic retrieval using the LLM.

    Input:
        question      -> Original user question
        parameters    -> Structured parameters extracted by classifier
        candidates    -> Broad SQL candidate queryset

    Output:
        QuerySet[Product]
    """

    candidates = list(candidates)

    if not candidates:
        return Product.objects.none()

    print("\n========== SEMANTIC RETRIEVAL ==========")
    print("Candidate Count:", len(candidates))

    prompt = build_candidate_prompt(
        question=question,
        parameters=parameters,
        products=candidates,
    )

    try:

        system_prompt = """
        You are a semantic retrieval engine.

        Return ONLY valid JSON.

        Never explain anything.
        """

        response = generate_json(
            system_prompt,
            prompt,
        )

    except Exception as e:

        print("Semantic Retrieval Error:", e)
        print("Falling back to broad candidates.")

        return candidates

    candidate_ids = response.get("candidate_ids", [])

    if not candidate_ids:

        print("LLM selected 0 candidates.")
        print("Returning broad candidates.")

        candidate_ids = [p.product_id for p in candidates]

        return Product.objects.filter(product_id__in=candidate_ids)

    print("Selected IDs:", candidate_ids)

    products = Product.objects.filter(product_id__in=candidate_ids)

    print("Semantic Products:", products.count())

    print("========================================\n")

    return products
