from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models import CustomUser
from ..serializers import UserSerializer


@api_view(["GET"])
def get_customers(request):
    users = CustomUser.objects.filter(role=CustomUser.Roles.CUSTOMER)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(["PUT", "DELETE"])
def customer_detail(request, id):
    user = CustomUser.objects.get(id=id)

    if request.method == "PUT":
        user.first_name = request.data["first_name"]
        user.last_name = request.data["last_name"]
        user.email = request.data["email"]
        user.save()
        return Response(UserSerializer(user).data)

    if request.method == "DELETE":
        user.delete()
        return Response({"message": "deleted"})
