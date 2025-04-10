# main.py
from face_embedding import generate_embeddings
from recognizer import recognize_face

# Step 1: Generate embeddings
generate_embeddings("Face_Recognition/dataset", "Face_Recognition/embeddings/face_data.pkl")

# Step 2: Recognize new face
result = recognize_face("Face_Recognition/test_image.jpg", "Face_Recognition/embeddings/face_data.pkl")
print("Match:", result)
