import os
from face_embedding import generate_embeddings
from utils.db_manager import initialize_db

# Define paths
dataset_path = "dataset"
embedding_path = "embeddings/face_data.pkl"
db_path = "database/embeddings.db"

# Ensure both folders exist
os.makedirs(os.path.dirname(embedding_path), exist_ok=True)
os.makedirs(os.path.dirname(db_path), exist_ok=True)

# Initialize database
initialize_db(db_path)

# Generate embeddings and store them
generate_embeddings(dataset_path, embedding_path)


# Step 2: Recognize new face
result = recognize_face("test_image.jpg", "embeddings/face_data.pkl")
print("Match:", result)

print(f"[✔] Embeddings stored in database: {db_path}")
print(f"[✔] Embeddings stored in pickle: {embedding_path}")
print("[✔] Face recognition system is ready to use.")