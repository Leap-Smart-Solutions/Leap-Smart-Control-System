import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from face_detection import extract_face
from models.vggface2_model import load_vggface2_model, get_embedding
import sqlite3
import json


def recognize_face(image_path, db_path="database/embeddings.db", threshold=0.8):
    model = load_vggface2_model()
    face = extract_face(image_path)
    if face is None:
        return "No face found.", 0.0  # Return a score of 0.0 for no face

    new_emb = get_embedding(model, face)

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT name, embedding FROM embeddings")
    records = cursor.fetchall()
    conn.close()

    best_match = None
    best_score = -1

    for name, embedding_json in records:
        stored_emb = np.array(json.loads(embedding_json))
        score = cosine_similarity([new_emb], [stored_emb])[0][0]
        print(f"[Similarity] {name}: {score:.4f}")  # Debug print
        if score > best_score:
            best_score = score
            best_match = name

    if best_score >= threshold:
        return best_match, best_score
    else:
        return "Unknown", best_score
