from ..utils import send_push
from ..models import DeviceToken
from ..serializers import ContactMessageSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from ..models import Notification, CustomUser, SupportConversation, SupportMessage

from ..serializers import SupportMessageSerializer
from rest_framework.permissions import IsAuthenticated


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def send_support_message(request):

    if request.method == "GET":
        try:
            conversation = SupportConversation.objects.get(user=request.user)

            messages = SupportMessage.objects.filter(
                conversation=conversation
            ).order_by("created_at")

            return Response(
                {
                    "success": True,
                    "data": [
                        {
                            "id": message.id,
                            "message": message.message,
                            "created_at": message.created_at,
                        }
                        for message in messages
                    ],
                }
            )

        except SupportConversation.DoesNotExist:
            return Response(
                {
                    "success": True,
                    "data": [],
                }
            )

    print(
        "USER:",
        request.user,
        "| AUTH HEADER RECEIVED:",
        request.META.get("HTTP_AUTHORIZATION"),
    )
    user = request.user
    message_text = request.data.get("message", "").strip()

    if not message_text:
        return Response(
            {"message": "Message cannot be empty."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    conversation, created = SupportConversation.objects.get_or_create(user=user)

    message = SupportMessage.objects.create(
        conversation=conversation,
        sender=user,
        message=message_text,
    )

    admins = CustomUser.objects.filter(role="admin")

    for admin in admins:

        Notification.objects.create(
            user=admin,
            message=f"New support message from {user.first_name} {user.last_name}",
        )

        # Use your existing FCM logic here
        # send_push(...)

    return Response(
        {
            "success": True,
            "message": "Message sent successfully.",
            "data": {
                "id": message.id,
                "message": message.message,
                "created_at": message.created_at,
            },
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_support_messages(request):

    conversation, created = SupportConversation.objects.get_or_create(user=request.user)

    messages = conversation.messages.select_related("sender").order_by("created_at")

    serializer = SupportMessageSerializer(messages, many=True)

    return Response(serializer.data)


@api_view(["POST"])
def contact(request):
    serializer = ContactMessageSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    contact_message = serializer.save()

    # Get all admin users
    admins = CustomUser.objects.filter(role="admin")

    print("========== CONTACT MESSAGE ==========")
    print("ADMINS:", admins)
    print("ADMIN COUNT:", admins.count())

    for admin in admins:

        print("CREATING NOTIFICATION FOR:", admin)

        message = (
            f"New contact message from "
            f"{contact_message.first_name} "
            f"{contact_message.last_name}"
        )

        # 1. Save notification in database
        Notification.objects.create(
            user=admin,
            message=message,
        )

        # 2. Get all FCM tokens belonging to this admin
        device_tokens = DeviceToken.objects.filter(user=admin)

        print(
            "Admin:",
            admin.first_name,
            "| Tokens found:",
            device_tokens.count(),
        )

        # 3. Send real-time push notification
        for device in device_tokens:
            print(
                "Sending push to:",
                admin.first_name,
                "| Token ID:",
                device.id,
                "| FCM:",
                device.token[:30],
            )

            try:
                send_push(
                    device.token,
                    "New Contact Message",
                    message,
                )

                print(
                    "✅ Contact notification sent to:",
                    admin.first_name,
                )

            except Exception as e:
                print(
                    "❌ Contact notification failed for",
                    admin.first_name,
                    ":",
                    repr(e),
                )

    return Response(
        {
            "success": True,
            "message": "Your message has been sent successfully.",
            "contact_id": contact_message.id,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_reply(request, conversation_id):

    if request.user.role != "admin":
        return Response(
            {"message": "Admin access required."},
            status=status.HTTP_403_FORBIDDEN,
        )

    message_text = request.data.get("message", "").strip()

    if not message_text:
        return Response(
            {"message": "Message cannot be empty."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    conversation = get_object_or_404(
        SupportConversation,
        id=conversation_id,
    )

    message = SupportMessage.objects.create(
        conversation=conversation,
        sender=request.user,
        message=message_text,
    )

    customer = conversation.user

    Notification.objects.create(
        user=customer,
        message="You have a new message from Support.",
    )

    # Existing FCM send_push() here

    return Response(
        {
            "success": True,
            "message": "Reply sent successfully.",
        },
        status=status.HTTP_201_CREATED,
    )
