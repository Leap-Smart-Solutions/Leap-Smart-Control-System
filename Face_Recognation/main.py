from face_detection import *

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