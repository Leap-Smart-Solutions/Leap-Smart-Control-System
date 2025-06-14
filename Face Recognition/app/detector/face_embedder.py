# app/embedder/face_embedder.py

import torch
import torch.nn as nn
import cv2
import numpy as np

class FaceEmbedder:
    def __init__(self, model_path="models/vggface2_light.pth"):
        self.model = self._load_model(model_path)
        self.model.eval()

    def _load_model(self, path):
        model = self._build_model()
        model.load_state_dict(torch.load(path, map_location=torch.device('cpu')))
        return model

    def _build_model(self):
        # Placeholder model definition (you must replace with actual structure)
        class MockVGGFace(nn.Module):
            def __init__(self):
                super().__init__()
                self.backbone = nn.Flatten()
                self.fc = nn.Linear(112*112*3, 512)

            def forward(self, x):
                return self.fc(self.backbone(x))
        return MockVGGFace()

    def preprocess(self, face_img):
        face = cv2.resize(face_img, (112, 112))
        face = cv2.cvtColor(face, cv2.COLOR_BGR2RGB)
        face = face.astype(np.float32) / 255.0
        face = np.transpose(face, (2, 0, 1))  # CHW
        return torch.tensor(face).unsqueeze(0)

    def get_embedding(self, face_img):
        with torch.no_grad():
            input_tensor = self.preprocess(face_img)
            emb = self.model(input_tensor)
            emb = emb.numpy().flatten()
            return emb / np.linalg.norm(emb)
