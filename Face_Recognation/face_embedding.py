# face_embedding.py
from models.vggface2_model import load_vggface2_model, get_embedding
from face_detection import extract_face
import os
import numpy as np
import pickle

def generate_embeddings(dataset_path, save_path):
    model = load_vggface2_model()
    embeddings = {}
    
    for person in os.listdir(dataset_path):
        person_dir = os.path.join(dataset_path, person)
        if not os.path.isdir(person_dir):
            continue
        for img_name in os.listdir(person_dir):
            img_path = os.path.join(person_dir, img_name)
            face = extract_face(img_path)
            if face is not None:
                emb = get_embedding(model, face)
                embeddings[img_path] = {
                    'person': person,
                    'embedding': emb
                }
    
    with open(save_path, 'wb') as f:
        pickle.dump(embeddings, f)
    print(f"Embeddings saved to {save_path}")
