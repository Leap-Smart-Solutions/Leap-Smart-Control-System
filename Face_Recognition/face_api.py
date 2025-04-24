from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse, StreamingResponse
import numpy as np
import cv2
import os
import requests
from io import BytesIO
from PIL import Image
import logging

# The modules
from face_detection import extract_face
from models.vggface2_model import load_vggface2_model, get_embedding
from utils.db_manager import insert_embedding, initialize_db
from recognizer import recognize_face

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Paths
DB_PATH = os.getenv("DB_PATH", "database/embeddings.db")
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
initialize_db(DB_PATH)

# Load model once
model = load_vggface2_model()

# Create FastAPI app
app = FastAPI()

@app.post("/add-face")
async def add_face(images: list[UploadFile] = File(...), person_name: str = Form(...)):
    if len(images) < 1 or len(images) > 10:  # Allow 1–10 images
        return JSONResponse(content={"error": "1 to 10 images are required."}, status_code=400)

    for idx, image in enumerate(images):
        contents = await image.read()
        np_img = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        face = extract_face(img)
        if face is None:
            return JSONResponse(content={"error": f"No face found in image {idx + 1}."}, status_code=400)

        embedding = get_embedding(model, face)
        insert_embedding(person_name, embedding.tolist(), image.filename, DB_PATH)

    return {"message": f"{len(images)} faces added for {person_name}"}

@app.post("/recognize")
async def recognize(image: UploadFile = File(...)):
    contents = await image.read()
    np_img = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    result = recognize_face(img, DB_PATH, threshold=0.85)

    return {"result": result}

@app.get("/video-stream")
async def video_stream():
    def generate_frames():
        # Fetch MJPEG stream from camera API
        camera_url = "https://c065-102-185-110-165.ngrok-free.app/mjpeg/1"
        stream = requests.get(camera_url, stream=True)
        
        if stream.status_code != 200:
            logger.error("Failed to connect to camera API")
            return

        bytes_data = bytes()
        for chunk in stream.iter_content(chunk_size=1024):
            bytes_data += chunk
            a = bytes_data.find(b'\xff\xd8')  # JPEG start
            b = bytes_data.find(b'\xff\xd9')  # JPEG end
            if a != -1 and b != -1:
                jpg = bytes_data[a:b+2]
                bytes_data = bytes_data[b+2:]
                
                # Decode frame
                frame = cv2.imdecode(np.frombuffer(jpg, dtype=np.uint8), cv2.IMREAD_COLOR)
                if frame is None:
                    continue

                # Process frame for face detection and recognition
                faces = extract_face(frame, return_all=True)  # Assume extract_face can return multiple faces
                for face, bbox in faces:
                    if face is not None:
                        embedding = get_embedding(model, face)
                        result = recognize_face(embedding=embedding, db_path=DB_PATH, threshold=0.85)
                        name = result.get("name", "Unknown") if result else "Unknown"
                        
                        # Draw bounding box and name
                        x, y, w, h = bbox
                        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
                        cv2.putText(frame, name, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

                # Encode frame back to JPEG
                ret, buffer = cv2.imencode('.jpg', frame)
                frame_bytes = buffer.tobytes()
                
                # Yield MJPEG frame
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("face_api:app", host="0.0.0.0", port=8000, reload=True)