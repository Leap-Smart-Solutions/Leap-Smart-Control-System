# app/recognition/face_recognizer.py
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from collections import defaultdict

class FaceRecognizer:
    def __init__(self, embedder, database, threshold=0.5):
        self.embedder = embedder
        self.database = database
        self.threshold = threshold

    def _get_mean_embeddings(self):
        records = self.database.fetch_all_embeddings()
        grouped = defaultdict(list)

        for name, emb in records:
            grouped[name].append(np.frombuffer(emb, dtype=np.float32))

        means = []
        for name, embs in grouped.items():
            mean = np.mean(embs, axis=0)
            means.append((name, mean))
        return means

    def recognize(self, face_img):
        new_embedding = self.embedder.get_embedding(face_img)
        known = self._get_mean_embeddings()

        for name, mean_emb in known:
            similarity = cosine_similarity([new_embedding], [mean_emb])[0][0]
            if similarity >= self.threshold:
                return name, similarity
        return "Unknown", 0.0
