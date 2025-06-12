# register_from_folder.py

import os
import cv2
from app.detector.face_detector import FaceDetector
from app.embedder.face_embedder import FaceEmbedder
from app.database.db_manager import EmbeddingDatabase

def register_all_faces(data_dir="data"):
    detector = FaceDetector(model_path="models/yolov8n-face.pt")
    embedder = FaceEmbedder(model_path="models/glint360k.onnx")
    db = EmbeddingDatabase()

    for person_name in os.listdir(data_dir):
        person_path = os.path.join(data_dir, person_name)
        if not os.path.isdir(person_path):
            continue

        for img_file in os.listdir(person_path):
            img_path = os.path.join(person_path, img_file)
            image = cv2.imread(img_path)

            if image is None:
                print(f"[!] Could not read: {img_path}")
                continue

            boxes = detector.detect_faces(image)
            if not boxes:
                print(f"[!] No face found in: {img_path}")
                continue

            x1, y1, x2, y2 = boxes[0]  # only use first face
            face = image[y1:y2, x1:x2]
            embedding = embedder.get_embedding(face)
            db.insert(person_name, embedding)

            print(f"[✓] Registered: {person_name} from {img_file}")

if __name__ == "__main__":
    register_all_faces("data")
