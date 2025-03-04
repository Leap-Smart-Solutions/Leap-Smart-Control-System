# Example Usage
from face_detection import FaceRecognitionSystem
import cv2


def main():
    # Create face recognition system
    fr_system = FaceRecognitionSystem()

    # Register faces (provide paths to training images)
    fr_system.register_face("John Doe", "path/to/john1.jpg")
    fr_system.register_face("John Doe", "path/to/john2.jpg")
    fr_system.register_face("Jane Smith", "path/to/jane1.jpg")

    # Recognize a face
    result = fr_system.recognize_face("path/to/test_image.jpg")
    print(result)

    # Detect faces in an image
    detected_image = fr_system.detect_faces_in_image("path/to/group_photo.jpg")
    if detected_image is not None:
        cv2.imshow("Detected Faces", detected_image)
        cv2.waitKey(0)
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
