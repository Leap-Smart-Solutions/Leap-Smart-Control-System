import cv2
import numpy as np
from ultralytics import YOLO

# Load the YOLOv8 model (nano variant for efficiency)
model = YOLO("yolov8n.pt")


def extract_face(image_path):
    """
    Detect and extract a face from an image using YOLOv8.

    Args:
        image_path (str): Path to the input image.

    Returns:
        numpy.ndarray: Cropped face image, or None if no face is detected.
    """
    # Read the image
    image = cv2.imread(image_path)
    if image is None:
        print(f"[ERROR] Could not read image at {image_path}")
        return None

    # Perform face detection using YOLOv8
    results = model.predict(
        image, conf=0.5, classes=[0]
    )  # Class 0 is 'person' in COCO dataset

    # Process the results
    for result in results:
        boxes = result.boxes.xyxy.cpu().numpy()  # Get bounding boxes
        for box in boxes:
            x1, y1, x2, y2 = map(int, box[:4])
            # Extract the face region (approximate the face as the upper part of the person's bounding box)
            face_height = (
                y2 - y1
            ) // 3  # Approximate face height as 1/3 of the person height
            face_y1 = y1
            face_y2 = y1 + face_height
            face = image[face_y1:face_y2, x1:x2]

            if face.size == 0:
                continue

            # Resize the face to a standard size (224x224 for VGGFace2)
            face = cv2.resize(face, (224, 224))
            return face

    print("[INFO] No face detected in the image.")
    return None
