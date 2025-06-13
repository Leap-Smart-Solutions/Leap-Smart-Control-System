# web/pages/2_Recognize.py
# web/pages/2_Recognize.py

import sys
import os

# ⬅️ This ensures Python sees the root project folder where "app" is
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

import streamlit as st
import cv2
import numpy as np
from PIL import Image
from app.detector.face_detector import FaceDetector
from app.embedder.face_embedder import FaceEmbedder
from app.database.db_manager import EmbeddingDatabase
from app.detector.face_recognizer import FaceRecognizer

st.title("🔍 Face Recognition from Image")

uploaded_file = st.file_uploader("Upload an image", type=["jpg", "jpeg", "png"])

if uploaded_file:
    image = Image.open(uploaded_file)
    image_np = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

    st.image(image, caption="Uploaded Image", use_column_width=True)

    # Process
    detector = FaceDetector(model_path="models/yolov8n-face.pt")
    embedder = FaceEmbedder(model_path="models/glint360k.onnx")
    db = EmbeddingDatabase()
    recognizer = FaceRecognizer(embedder, db)

    faces = detector.detect_faces(image_np)
    
    if not faces:
        st.warning("No face detected.")
    else:
        for i, (x1, y1, x2, y2) in enumerate(faces):
            face = image_np[y1:y2, x1:x2]
            name, score = recognizer.recognize(face)
            st.success(f"Face {i+1}: {name} (Confidence: {score:.2f})")
            st.image(cv2.cvtColor(face, cv2.COLOR_BGR2RGB), width=180)

            # Firebase notification if unknown (we'll implement it later)
            if name == "Unknown":
                st.warning("⚠️ Unknown face detected! (This will trigger Firebase alert)")
