# app/utils/firebase_notifier.py

import firebase_admin
from firebase_admin import credentials, messaging, db
import base64
import cv2
import numpy as np
import os
from datetime import datetime

# Path to your Firebase Admin SDK JSON
FIREBASE_CRED_PATH = "secrets/firebase_admin.json"

# Firebase Realtime Database URL
FIREBASE_DB_URL = "https://leap-smart-band-default-rtdb.firebaseio.com/"

# Initialize Firebase only once
if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_CRED_PATH)
    firebase_admin.initialize_app(cred, {
        'databaseURL': FIREBASE_DB_URL
    })


def send_unknown_alert(image_np):
    # Convert image to base64
    _, jpeg = cv2.imencode('.jpg', cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB))
    img_base64 = base64.b64encode(jpeg.tobytes()).decode('utf-8')

    # Push to Realtime Database → /thief = 1
    try:
        db.reference("thief").set(1)
        print("[Firebase RTDB] ✅ Set 'thief' = 1")
    except Exception as e:
        print("[Firebase RTDB] ❌ Failed to set 'thief':", e)

    # Send FCM Push Notification
    message = messaging.Message(
        notification=messaging.Notification(
            title="🚨 Unknown Face Detected",
            body="Someone not recognized appeared on camera.",
        ),
        data={
            "face_image_base64": img_base64
        },
        topic="face_alerts"
    )

    try:
        response = messaging.send(message)
        print("[FCM] ✅ Notification sent:", response)
    except Exception as e:
        print("[FCM] ❌ Error sending notification:", e)


def send_custom_notification(title, body):
    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body,
        ),
        topic="face_alerts"
    )

    try:
        response = messaging.send(message)
        print("[FCM] ✅ Custom notification sent:", response)
    except Exception as e:
        print("[FCM] ❌ Error:", e)
