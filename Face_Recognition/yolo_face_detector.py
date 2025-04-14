# Face_Recognition/yolo_face_detector.py

import cv2
import numpy as np
from ultralytics import YOLO
import os


class YOLOFaceDetector:
    def __init__(self, model_path="yolov8n-face.pt", confidence=0.5):
        self.model = YOLO(model_path)
        self.confidence = confidence

    def detect_faces(self, frame):
        """
        Detect faces in the given frame using YOLOv8.
        Returns a list of cropped face images and their bounding boxes.
        """
        results = self.model.predict(frame, conf=self.confidence, verbose=False)
        face_crops = []
        boxes = []

        for result in results:
            if result.boxes is not None:
                for box in result.boxes.xyxy.cpu().numpy():
                    x1, y1, x2, y2 = map(int, box)
                    face_crop = frame[y1:y2, x1:x2]
                    if face_crop.size > 0:
                        face_crops.append(face_crop)
                        boxes.append((x1, y1, x2, y2))

        return face_crops, boxes

    def draw_boxes(self, frame, boxes, labels=None):
        """
        Draws bounding boxes with optional labels on the frame.
        """
        for i, (x1, y1, x2, y2) in enumerate(boxes):
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            if labels:
                cv2.putText(
                    frame,
                    labels[i],
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    (0, 255, 0),
                    2,
                )
        return frame
