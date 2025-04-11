import cv2
import numpy as np
from ultralytics import YOLO

# Load the YOLOv8 model with mixed precision
model = YOLO("yolov8n.pt")
if model.device.type == "cuda":
    model = model.half()  # Enable mixed precision (FP16)


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

    # Resize image for faster inference
    image = cv2.resize(image, (416, 416))  # Reduced size for efficiency

    # Perform face detection using YOLOv8
    results = model.predict(image, conf=0.5, classes=[0])  # Class 0 is 'person'

    # Process the results
    for result in results:
        boxes = result.boxes.xyxy.cpu().numpy()
        for box in boxes:
            x1, y1, x2, y2 = map(int, box[:4])
            face_height = (y2 - y1) // 3
            face_y1 = y1
            face_y2 = y1 + face_height
            face = image[face_y1:face_y2, x1:x2]

            if face.size == 0:
                continue

            # Resize the face to 224x224 for VGGFace2
            face = cv2.resize(face, (224, 224))
            return face

    print("[INFO] No face detected in the image.")
    return None
