from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.response import Response

from shop.ai.gemini import classify_question
from shop.ai.dispatcher import dispatch
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def ai_query(request):
    question = request.data.get("question")
    if not question:
        return Response({"error": "Question is required"}, status=400)

    user_role = request.user.role
    print("user role: ", user_role)
    ai_result = classify_question(question, user_role)
    print("ai result: ", ai_result)
    intent = ai_result.get("intent")
    print("ai intent: ", intent)
    parameters = ai_result.get("parameters")
    result = dispatch(
        intent, parameters, request.user
    )  # later we will need notifications, orders, id and all attributes of user
    return Response(result)
