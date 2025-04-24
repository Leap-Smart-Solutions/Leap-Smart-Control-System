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
DB_PATH = os.getenv("DB_PATH", "database/embeddings.db")
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
initialize_db(DB_PATH)

# Load model once
model = load_vggface2_model()

# Create FastAPI app
app = FastAPI()


@app.post("/add-face")
async def add_face(images: list[UploadFile] = File(...), person_name: str = Form(...)):
    # Validate the number of images
    if len(images) != 3:
        return JSONResponse(content={"error": "Exactly three images are required."}, status_code=400)

    # Process each image
    for idx, image in enumerate(images):
        contents = await image.read()
        np_img = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        face = extract_face(img)
        if face is None:
            return JSONResponse(content={"error": f"No face found in image {idx + 1}."}, status_code=400)

        embedding = get_embedding(model, face)
        insert_embedding(person_name, embedding.tolist(), image.filename, DB_PATH)

    return {"message": f"Three faces added for {person_name}"}


@app.post("/recognize")
async def recognize(image: UploadFile = File(...)):
    contents = await image.read()
    np_img = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    result = recognize_face(img, DB_PATH, threshold=0.85)

    return {"result": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("face_api:app", host="0.0.0.0", port=8000, reload=True)