from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
import numpy as np
import cv2
import os

# The modules
from Face_Recognition.Archive.face_detection import extract_face
from models.vggface2_model import load_vggface2_model, get_embedding
from utils.db_manager import insert_embedding, initialize_db
from Face_Recognition.Archive.recognizer import recognize_face

# Paths
DB_PATH = "database/embeddings.db"
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
initialize_db(DB_PATH)

# Load model once
model = load_vggface2_model()

# Create FastAPI app
app = FastAPI()


@app.post("/add-face")
async def add_face(image: UploadFile = File(...), person_name: str = Form(...)):
    contents = await image.read()
    np_img = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    face = extract_face(img)
    if face is None:
        return JSONResponse(content={"error": "No face found."}, status_code=400)

    embedding = get_embedding(model, face)
    insert_embedding(person_name, embedding.tolist(), image.filename, DB_PATH)

    return {"message": f"Face added for {person_name}"}


@app.post("/recognize")
async def recognize(image: UploadFile = File(...)):
    contents = await image.read()
    np_img = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    result = recognize_face(img, DB_PATH, threshold=0.85)

    return {"result": result}
