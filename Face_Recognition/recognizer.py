# recognizer.py
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from face_detection import extract_face
from models.vggface2_model import load_vggface2_model, get_embedding
import sqlite3
import json

def recognize_face(image_path, db_path='embeddings/face_embeddings.db'):
    model = load_vggface2_model()
    face = extract_face(image_path)
    if face is None:
        return "No face found."

    new_emb = get_embedding(model, face)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT name, embedding FROM face_embeddings")
    records = cursor.fetchall()
    conn.close()

    best_match = None
    best_score = -1

    for name, embedding_json in records:
        stored_emb = np.array(json.loads(embedding_json))
        score = cosine_similarity([new_emb], [stored_emb])[0][0]
        if score > best_score:
            best_score = score
            best_match = name

    return best_match if best_score > 0.5 else "Unknown"
