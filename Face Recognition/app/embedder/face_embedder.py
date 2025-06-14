import onnxruntime as ort
import numpy as np
import cv2

class FaceEmbedder:
    def __init__(self, model_path="models/glint360k.onnx"):  # must convert your .pth to .onnx
        self.session = ort.InferenceSession(model_path)
        self.input_name = self.session.get_inputs()[0].name

    def preprocess(self, face_img):
        face = cv2.resize(face_img, (112, 112))
        face = cv2.cvtColor(face, cv2.COLOR_BGR2RGB)
        face = np.transpose(face, (2, 0, 1)).astype(np.float32)
        face = np.expand_dims(face, axis=0) / 255.0
        return face

    def get_embedding(self, face_img):
        input_tensor = self.preprocess(face_img)
        emb = self.session.run(None, {self.input_name: input_tensor})[0][0]
        return emb / np.linalg.norm(emb)