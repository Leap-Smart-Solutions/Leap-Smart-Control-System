# Create a clean YOLOFaceDetector class inside the new core module system

from ultralytics import YOLO
import cv2
import os


class YOLOFaceDetector:
    def __init__(self, model_path="models/yolo/yolov8n-face-lindevs.pt", confidence=0.5):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"YOLO model not found at {model_path}")
        self.model = YOLO(model_path)
        self.confidence = confidence

    def detect_faces(self, frame):
        results = self.model.predict(source=frame, conf=self.confidence, verbose=False)
        boxes = []

        for r in results:
            if r.boxes is not None:
                for box in r.boxes:
                    conf = float(box.conf[0])
                    if conf >= self.confidence:
                        x1, y1, x2, y2 = map(int, box.xyxy[0])
                        boxes.append((x1, y1, x2, y2))

        return boxes

    def extract_faces(self, frame, target_size=(224, 224)):
        faces = []
        boxes = self.detect_faces(frame)
        for (x1, y1, x2, y2) in boxes:
            face = frame[y1:y2, x1:x2]
            if face.size == 0:
                continue
            face = cv2.resize(face, target_size)
            faces.append(face)
        return faces

    def draw_boxes(self, frame, boxes, color=(0, 255, 0)):
        for x1, y1, x2, y2 in boxes:
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
        return frame
