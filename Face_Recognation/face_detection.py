import cv2
import numpy as np
import dlib
import sqlite3
import os
from datetime import datetime


# --- Database Setup ---
def setup_database():
    conn = sqlite3.connect("face_recognition.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            embedding BLOB NOT NULL
        )
    """)
    conn.commit()
    conn.close()


# --- Store Face Embedding in Database ---
def store_face_embedding(name, embedding):
    conn = sqlite3.connect("face_recognition.db")
    cursor = conn.cursor()
    embedding_blob = embedding.tobytes()  # Convert numpy array to binary
    cursor.execute("INSERT INTO users (name, embedding) VALUES (?, ?)", (name, embedding_blob))
    conn.commit()
    conn.close()
    print(f"Stored embedding for {name} in database.")


# --- Load Known Embeddings from Database ---
def load_known_embeddings():
    conn = sqlite3.connect("face_recognition.db")
    cursor = conn.cursor()
    cursor.execute("SELECT name, embedding FROM users")
    rows = cursor.fetchall()
    known_embeddings = {}
    for name, embedding_blob in rows:
        embedding = np.frombuffer(embedding_blob, dtype=np.float64)  # Convert binary back to numpy array
        known_embeddings[name] = embedding
    conn.close()
    return known_embeddings


# --- Initialize dlib Models ---
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
face_recognizer = dlib.face_recognition_model_v1("dlib_face_recognition_resnet_model_v1.dat")


# --- Compute Face Embedding ---
def compute_embedding(image, face_rect):
    shape = predictor(image, face_rect)
    embedding = face_recognizer.compute_face_descriptor(image, shape)
    return np.array(embedding)  # 128-dimensional vector


# --- Register Faces from Dataset ---
def register_faces(dataset_path):
    if not os.path.exists(dataset_path):
        print(f"Dataset path {dataset_path} does not exist!")
        return

    for person_name in os.listdir(dataset_path):
        person_dir = os.path.join(dataset_path, person_name)
        if not os.path.isdir(person_dir):
            continue

        # Take the first image for each person as their reference
        for image_file in os.listdir(person_dir):
            image_path = os.path.join(person_dir, image_file)
            img = cv2.imread(image_path)
            if img is None:
                print(f"Failed to load {image_path}")
                continue

            faces = detector(img)
            if len(faces) == 0:
                print(f"No face detected in {image_path}")
                continue

            embedding = compute_embedding(img, faces[0])
            store_face_embedding(person_name, embedding)
            print(f"Registered {person_name} from {image_path}")
            break  # One image per person for simplicity


# --- Real-Time Face Recognition ---
def recognize_face(embedding, known_embeddings, threshold=0.6):
    min_dist = float("inf")
    identity = "Unknown"

    for name, known_embedding in known_embeddings.items():
        distance = np.linalg.norm(embedding - known_embedding)  # Euclidean distance
        if distance < min_dist:
            min_dist = distance
            if min_dist < threshold:  # Threshold for dlib
                identity = name

    return identity, min_dist


def main():
    # Setup database
    setup_database()

    # Path to your dataset (e.g., LFW or custom dataset)
    dataset_path = "lfw-deepfunneled"  # Update this to your dataset path
    register_faces(dataset_path)

    # Load known embeddings
    known_embeddings = load_known_embeddings()
    if not known_embeddings:
        print("No known faces registered. Please add faces to the dataset.")
        return

    # Start webcam
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    print("Starting real-time face recognition. Press 'q' to quit.")
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Could not read frame.")
            break

        # Detect faces
        faces = detector(frame)
        for face in faces:
            x, y, w, h = (face.left(), face.top(), face.right() - face.left(), face.bottom() - face.top())

            try:
                # Compute embedding
                embedding = compute_embedding(frame, face)

                # Recognize the face
                identity, distance = recognize_face(embedding, known_embeddings)

                # Display result
                label = f"{identity} (Dist: {distance:.2f})"
                color = (0, 255, 0) if identity != "Unknown" else (0, 0, 255)
                cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
                cv2.putText(frame, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)
            except Exception as e:
                print(f"Error recognizing face: {e}")

        # Show the frame
        cv2.imshow("Facial Recognition", frame)

        # Quit on 'q'
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    # Cleanup
    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()