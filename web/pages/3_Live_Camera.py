# web/pages/3_Live_Camera.py
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

import streamlit as st
from streamlit_webrtc import webrtc_streamer, VideoTransformerBase
import cv2
import numpy as np
from app.detector.face_detector import FaceDetector
from app.embedder.face_embedder import FaceEmbedder
from app.database.db_manager import EmbeddingDatabase
from app.detector.face_recognizer import FaceRecognizer
from app.utils.firebase_notifier import send_unknown_alert

st.set_page_config(page_title="Live Camera", layout="centered")
st.title("📷 Live Face Recognition")

# Initialize models globally to avoid reloading every frame
detector = FaceDetector(model_path="models/yolov8n-face.pt")
embedder = FaceEmbedder(model_path="models/glint360k.onnx")
db = EmbeddingDatabase()
recognizer = FaceRecognizer(embedder, db)


class FaceRecognitionTransformer(VideoTransformerBase):
    def __init__(self):
        self.already_alerted = set()

    def transform(self, frame):
        img = frame.to_ndarray(format="bgr24")
        faces = detector.detect_faces(img)

        for (x1, y1, x2, y2) in faces:
            face = img[y1:y2, x1:x2]
            name, score = recognizer.recognize(face)

            print("[Camera] Face Detected:", name, f"Confidence: {score:.2f}")

            if name == "Unknown":
                face_id = f"{x1}_{y1}_{x2}_{y2}"
                if face_id not in self.already_alerted:
                    send_unknown_alert(face)  # ✅ Send face crop with base64
                    self.already_alerted.add(face_id)

            label = f"{name} ({score:.2f})" if name != "Unknown" else "❓ Unknown"
            color = (0, 255, 0) if name != "Unknown" else (0, 0, 255)

            cv2.rectangle(img, (x1, y1), (x2, y2), color, 2)
            cv2.putText(img, label, (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

        return img


webrtc_streamer(
    key="face-recognition-live",
    video_transformer_factory=FaceRecognitionTransformer,
    media_stream_constraints={"video": True, "audio": False},
    async_transform=True
)
