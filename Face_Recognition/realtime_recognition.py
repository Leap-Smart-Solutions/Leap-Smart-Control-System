import cv2
import os
import numpy as np
from datetime import datetime
from playsound import playsound
from utils.db_manager import get_all_embeddings, log_recognition_event
from models.vggface2_model import recognize_face
from yolo_face_detector import YOLOFaceDetector
import argparse

# Initialize YOLOv8 face detector
detector = YOLOFaceDetector(model_path="models/yolo/yolov8n-face-lindevs.pt")

# Load database embeddings
db_path = "database/embeddings.db"
known_embeddings, labels = get_all_embeddings(db_path)

# Paths
UNKNOWN_DIR = "unknown_faces"
if not os.path.exists(UNKNOWN_DIR):
    os.makedirs(UNKNOWN_DIR)
ALERT_SOUND_PATH = "utils/buzz.mp3"  # Ensure this file exists

# Recognition threshold
THRESHOLD = 0.5


def process_frame(frame):
    faces = detector.detect_faces(frame)
    for x1, y1, x2, y2 in faces:  # Unpack tuple directly
        # Ensure valid crop region
        if (
            x1 < 0
            or y1 < 0
            or x2 > frame.shape[1]
            or y2 > frame.shape[0]
            or x2 <= x1
            or y2 <= y1
        ):
            continue
        face_crop = frame[y1:y2, x1:x2]

        # Resize face_crop to (224, 224) as expected by VGGFace
        face_crop = cv2.resize(face_crop, (224, 224))

        name, similarity = recognize_face(
            face_crop, known_embeddings, labels, threshold=THRESHOLD
        )

        if name == "Unknown":
            # Save unknown face
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            unknown_path = os.path.join(UNKNOWN_DIR, f"unknown_{timestamp}.jpg")
            cv2.imwrite(unknown_path, face_crop)

            # Play alarm sound (comment out if buzz.mp3 is missing)
            try:
                playsound(ALERT_SOUND_PATH)
            except Exception as e:
                print(f"[WARNING] Failed to play sound: {e}")

            # Log alert
            log_recognition_event("Unknown")
        else:
            log_recognition_event(name)

        # Draw box and label
        label = f"{name} ({similarity:.2f})" if name != "Unknown" else name
        cv2.rectangle(
            frame,
            (x1, y1),
            (x2, y2),
            (0, 255, 0) if name != "Unknown" else (0, 0, 255),
            2,
        )
        cv2.putText(
            frame,
            label,
            (x1, y1 - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            (255, 255, 255),
            1,
        )

    return frame


def recognize_from_source(source=0):
    cap = cv2.VideoCapture(source)
    if not cap.isOpened():
        print(f"[ERROR] Could not open source: {source}")
        return
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame = process_frame(frame)
        cv2.imshow("Recognition", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break
    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Real-time face recognition")
    parser.add_argument(
        "--mode", default="webcam", choices=["image", "video", "webcam"]
    )
    parser.add_argument("--source", default="0")
    args = parser.parse_args()

    if args.mode == "image":
        frame = cv2.imread(args.source)
        if frame is None:
            print(f"[ERROR] Could not read image: {args.source}")
        else:
            frame = process_frame(frame)
            cv2.imshow("Recognition", frame)
            cv2.waitKey(0)
            cv2.destroyAllWindows()
    else:
        source = 0 if args.mode == "webcam" else args.source
        recognize_from_source(source)
