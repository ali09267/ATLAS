from firebase_admin import messaging


def send_push(token, title, body):
    try:
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

        return response

    except messaging.UnregisteredError:
        print("Firebase Error: Token is no longer registered")
        raise

    except Exception as e:
        print("Firebase Error:", repr(e))
        raise
