import os
from face_embedding import generate_embeddings
from utils.db_manager import initialize_db
from recognizer import recognize_face

# Paths
dataset_path = "dataset"
embedding_path = "embeddings/face_data.pkl"
db_path = "database/embeddings.db"

# Ensure directories exist
os.makedirs(os.path.dirname(embedding_path), exist_ok=True)
os.makedirs(os.path.dirname(db_path), exist_ok=True)

# Initialize and generate
initialize_db(db_path)
generate_embeddings(dataset_path, db_path)

# Test recognition
result = recognize_face("test_image_1.jpg", db_path, threshold=0.85)
if result == "No face found.":
    print("No face found in the image.")
elif result == "Unknown":
    print("Face not recognized.")
else:
    print("Match:", result)

print(f"[✔] Embeddings stored in database: {db_path}")
print(f"[✔] Embeddings stored in pickle: {embedding_path}")
print("[✔] Face recognition system is ready to use.")
