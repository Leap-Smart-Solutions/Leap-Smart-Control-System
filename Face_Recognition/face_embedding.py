import os
import pickle
from face_detection import extract_face
from models.vggface2_model import load_vggface2_model, get_embedding

def generate_embeddings(dataset_path, save_path):
    model = load_vggface2_model()
    embeddings = []

    for person in os.listdir(dataset_path):
        person_dir = os.path.join(dataset_path, person)
        if not os.path.isdir(person_dir):
            continue

        for img_name in os.listdir(person_dir):
            img_path = os.path.join(person_dir, img_name)
            face = extract_face(img_path)
            if face is not None:
                emb = get_embedding(model, face)
                embeddings.append({
                    'name': person,
                    'embedding': emb.tolist(),  # So it's JSON/db serializable
                    'image_path': img_path
                })
            else:
                print(f"[!] Face not found in: {img_path}")

    with open(save_path, 'wb') as f:
        pickle.dump(embeddings, f)
    print(f"[✔] Embeddings saved to: {save_path}")


if __name__ == "__main__":
    dataset_path = r"dataset"
    save_path = r"embeddings\embeddings.pkl"
    generate_embeddings(dataset_path, save_path)
