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
    model = model.cuda()  # Move to GPU if available
    model = model.half()  # Enable mixed precision (FP16)


def recognize_face(image_path, db_path="database/embeddings.db", threshold=0.8):
    """
    Recognize a face in an image using VGGFace2.

    Args:
        image_path (str): Path to the input image.
        db_path (str): Path to the embeddings database.
        threshold (float): Similarity threshold for recognition.

    Returns:
        tuple: (str, float) - The recognized name (or "Unknown") and the best similarity score.
    """
    face = extract_face(image_path)  # Now uses YOLOv8 for detection
    if face is None:
        return "No face found.", 0.0

    # Extract embedding using VGGFace2
    new_emb = get_embedding(model, face)
    if torch.cuda.is_available():
        new_emb = new_emb.cuda().half()  # Convert to FP16 for mixed precision

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
