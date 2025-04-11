import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import sqlite3
import json
from face_detection import extract_face
from models.vggface2_model import load_vggface2_model, get_embedding
import torch

# Load the VGGFace2 model
model = load_vggface2_model()
if torch.cuda.is_available():
    model = model.cuda()
    model = model.half()


def recognize_face(image_path, db_path="database/embeddings.db", threshold=0.8):
    face = extract_face(image_path)
    if face is None:
        return "No face found.", 0.0

    # Optimize preprocessing for VGGFace2
    face = face / 255.0  # Normalize to [0, 1]
    face = np.transpose(face, (2, 0, 1))  # Convert to (C, H, W) for PyTorch
    face = torch.tensor(
        face, dtype=torch.float16 if torch.cuda.is_available() else torch.float32
    )
    if torch.cuda.is_available():
        face = face.cuda()

    # Extract embedding using VGGFace2
    new_emb = get_embedding(model, face)
    if torch.cuda.is_available():
        new_emb = new_emb.cuda().half()

    # Load embeddings from the database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT name, embedding FROM embeddings")
    records = cursor.fetchall()
    conn.close()

    best_match = None
    best_score = -1

    for name, embedding_json in records:
        stored_emb = np.array(json.loads(embedding_json))
        score = cosine_similarity([new_emb.cpu().numpy()], [stored_emb])[0][0]
        print(f"[Similarity] {name}: {score:.4f}")
        if score > best_score:
            best_score = score
            best_match = name

    if best_score >= threshold:
        return best_match, best_score
    else:
        return "Unknown", best_score
