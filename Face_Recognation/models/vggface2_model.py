from keras_vggface.vggface import VGGFace
from keras_vggface.utils import preprocess_input
from keras.models import Model
import numpy as np

def load_vggface2_model():
    model = VGGFace(model='resnet50', include_top=False, input_shape=(224, 224, 3), pooling='avg')
    return model

def get_embedding(model, face_pixels):
    face_pixels = face_pixels.astype('float32')
    face_pixels = preprocess_input(face_pixels, version=2)  # For ResNet
    sample = np.expand_dims(face_pixels, axis=0)
    yhat = model.predict(sample)
    return yhat[0]
