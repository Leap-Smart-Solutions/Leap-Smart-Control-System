# recognizer.py
import numpy as np
import pickle
from sklearn.metrics.pairwise import cosine_similarity
from face_detection import extract_face
from models.vggface2_model import load_vggface2_model, get_embedding

def recognize_face(image_path, embeddings_path):
    model = load_vggface2_model()
    face = extract_face(image_path)
    if face is None:
        return "No face found."

    new_emb = get_embedding(model, face)

    with open(embeddings_path, 'rb') as f:
        stored = pickle.load(f)
    
    best_match = None
    best_score = -1

    for data in stored.values():
        sim = cosine_similarity([new_emb], [data['embedding']])[0][0]
        if sim > best_score:
            best_score = sim
            best_match = data['person']
    
    return best_match if best_score > 0.5 else "Unknown"
