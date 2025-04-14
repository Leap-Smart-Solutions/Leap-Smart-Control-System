from keras_vggface.vggface import VGGFace
from keras_vggface.utils import preprocess_input
from keras.models import Model
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


def load_vggface2_model():
    model = VGGFace(
        model="resnet50", include_top=False, input_shape=(224, 224, 3), pooling="avg"
    )
    return model


def get_embedding(model, face_pixels):
    face_pixels = face_pixels.astype("float32")
    face_pixels = preprocess_input(face_pixels, version=2)  # For ResNet
    sample = np.expand_dims(face_pixels, axis=0)
    yhat = model.predict(sample)
    return yhat[0]


def recognize_face(face_crop, known_embeddings, labels, threshold=0.5):
    model = load_vggface2_model()
    new_emb = get_embedding(model, face_crop)
    best_score = -1
    best_label = "Unknown"

    for stored_emb, label in zip(known_embeddings, labels):
        score = cosine_similarity([new_emb], [np.array(stored_emb)])[0][0]
        if score > best_score:
            best_score = score
            best_label = label if score >= threshold else "Unknown"

    return best_label, best_score
