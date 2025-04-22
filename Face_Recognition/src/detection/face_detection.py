import cv2


def extract_face(image, target_size=(224, 224)):
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    if isinstance(image, str):
        img = cv2.imread(image)

        if img is None:
            return None
    else:
        img = image.copy()

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)

    if len(faces) == 0:
        return None

    x, y, w, h = faces[0]
    face = img[y : y + h, x : x + w]
    face = cv2.resize(face, target_size)
    return face
