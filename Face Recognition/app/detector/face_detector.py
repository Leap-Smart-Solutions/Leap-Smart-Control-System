# app/detector/face_detector.py

from ultralytics import YOLO
import cv2

class FaceDetector:
    def __init__(self, model_path="models/yolov8n-face.pt", conf_threshold=0.5):
        self.model = YOLO(model_path)
        self.conf_threshold = conf_threshold

    def detect_faces(self, image):
        results = self.model(image)[0]
        boxes = []

        for box in results.boxes:
            if box.conf[0] >= self.conf_threshold:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                boxes.append((x1, y1, x2, y2))

        return boxes
