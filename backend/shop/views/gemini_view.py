from shop.ai.gemini import classify_question

from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def gemini_test(request):

    result = classify_question("What is the total number of customers?")

    return Response(result)
