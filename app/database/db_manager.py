# app/database/db_manager.py

import sqlite3
import numpy as np

class EmbeddingDatabase:
    def __init__(self, db_path='data/embeddings.db'):
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self._create_table()

    def _create_table(self):
        query = """CREATE TABLE IF NOT EXISTS embeddings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            embedding BLOB
        )"""
        self.conn.execute(query)
        self.conn.commit()

    def insert_embedding(self, name, embedding):
        blob = embedding.astype(np.float32).tobytes()
        self.conn.execute("INSERT INTO embeddings (name, embedding) VALUES (?, ?)", (name, blob))
        self.conn.commit()

    def fetch_all_embeddings(self):
        cursor = self.conn.execute("SELECT name, embedding FROM embeddings")
        return cursor.fetchall()

    def delete_by_name(self, name):
        self.conn.execute("DELETE FROM embeddings WHERE name = ?", (name,))
        self.conn.commit()
