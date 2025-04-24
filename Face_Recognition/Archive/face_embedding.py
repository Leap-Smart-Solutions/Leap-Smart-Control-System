import os
from Face_Recognition.Archive.face_detection import extract_face
from models.vggface2_model import load_vggface2_model, get_embedding
from utils.db_manager import initialize_db, insert_embedding


def generate_embeddings(dataset_path, db_path):
    model = load_vggface2_model()
    initialize_db(db_path)

    for person in os.listdir(dataset_path):
        person_dir = os.path.join(dataset_path, person)
        if not os.path.isdir(person_dir):
            continue

        for img_name in os.listdir(person_dir):
            img_path = os.path.join(person_dir, img_name)
            face = extract_face(img_path)
            if face is not None:
                emb = get_embedding(model, face)
                insert_embedding(person, emb.tolist(), img_path, db_path)

    print(f"[✔] Embeddings stored in database: {db_path}")


if __name__ == "__main__":
    dataset_path = r"dataset"
    db_path = r"database\embeddings.db"
    generate_embeddings(dataset_path, db_path)
