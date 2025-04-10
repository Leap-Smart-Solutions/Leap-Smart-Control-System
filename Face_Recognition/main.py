from face_embedding import generate_embeddings
from recognizer import recognize_face

# Step 1: Generate embeddings
generate_embeddings(r"dataset", r"embeddings\embeddings.pkl")

# Step 2: Recognize new face
result = recognize_face(r"test_image.jpg", r"embeddings\embeddings.pkl")
print("Match:", result)
