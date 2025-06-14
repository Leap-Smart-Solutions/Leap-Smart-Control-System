# web/pages/1_Register.py
import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

import streamlit as st
import cv2
import numpy as np
from PIL import Image
from app.detector.face_detector import FaceDetector
from app.embedder.face_embedder import FaceEmbedder
from app.detector.face_recognizer import FaceRecognizer
from app.database.db_manager import EmbeddingDatabase
from app.utils.firebase_notifier import send_custom_notification

st.set_page_config(page_title="Register Faces", layout="wide")
st.title("📝 Register Faces from Image")

uploaded = st.file_uploader("Upload an image with one or more faces", type=["jpg", "jpeg", "png"])

# Initialize
detector = FaceDetector(model_path="models/yolov8n-face.pt")
embedder = FaceEmbedder(model_path="models/glint360k.onnx")
db = EmbeddingDatabase()
recognizer = FaceRecognizer(embedder, db)

if uploaded:
    img = Image.open(uploaded)
    img_np = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)

    faces = detector.detect_faces(img_np)

    st.write(f"🧠 Detected {len(faces)} face(s)")

    names_to_register = []

    for idx, (x1, y1, x2, y2) in enumerate(faces):
        face = img_np[y1:y2, x1:x2]
        name, score = recognizer.recognize(face)

        color = (0, 255, 0) if name != "Unknown" else (0, 0, 255)
        label = name if name != "Unknown" else f"New Face #{idx+1}"

        cv2.rectangle(img_np, (x1, y1), (x2, y2), color, 2)
        cv2.putText(img_np, label, (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 2, color, 2)

        if name == "Unknown":
            new_name = st.text_input(f"Enter name for New Face #{idx+1}")
            names_to_register.append((new_name, face))
        else:
            st.success(f"✅ {name} is already registered.")

    st.image(cv2.cvtColor(img_np, cv2.COLOR_BGR2RGB), channels="RGB", caption="Detected Faces")

    if st.button("Register New Faces"):
        for name, face_crop in names_to_register:
            if name.strip():
                emb = embedder.get_embedding(face_crop)
                db.insert_embedding(name.strip(), emb)
                send_custom_notification("🆕 New Face Registered", f"{name} has been added.")
                st.success(f"Face registered for {name}")
            else:
                st.warning("❌ Some names are missing!")
