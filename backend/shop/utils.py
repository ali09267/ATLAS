from firebase_admin import messaging


def send_push(token, title, body):
    try:
        print("Token:", token)

        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            token=token,
        )

        response = messaging.send(message)

        print("Firebase Response:", response)

        return response

    except Exception as e:
        print("Firebase Error:", repr(e))
        raise
