import os
import gdown


def download_yolo_face_model(save_path="yolo_models/yolov8n-face.pt"):
    url = "https://drive.google.com/uc?id=1n5NR28JQWbxzeVPO1g5gsqL71b1R8kQG"

    if not os.path.exists(save_path):
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        print("[INFO] Downloading YOLOv8-Face model...")
        gdown.download(url, save_path, quiet=False)
        print("[DONE] Model downloaded to:", save_path)
    else:
        print("[INFO] Model already exists at:", save_path)


if __name__ == "__main__":
    download_yolo_face_model()
