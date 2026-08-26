from firebase_admin import messaging
from .models import DeviceToken


def send_push(token, title, body):
    try:
        print("========================================")
        print("Sending FCM notification")
        print("Token:", token)

        message = messaging.Message(
            notification=messaging.Notification(
                title=str(title),
                body=str(body),
            ),
            data={
                "type": "order_status",
            },
            webpush=messaging.WebpushConfig(
                notification=messaging.WebpushNotification(
                    icon="/favicon.ico",
                    badge="/favicon.ico",
                )
            ),
            token=token,
        )

        response = messaging.send(message)

        print("Firebase Response:", response)
        print("✅ FCM notification sent successfully")

        return response

    except messaging.UnregisteredError:
        print("❌ Firebase Error: Token is no longer registered")

        deleted_count, _ = DeviceToken.objects.filter(token=token).delete()

        print("🗑️ Stale token removed:", deleted_count)

        return None

    except Exception as e:
        print("❌ Firebase Error:", repr(e))
        raise
