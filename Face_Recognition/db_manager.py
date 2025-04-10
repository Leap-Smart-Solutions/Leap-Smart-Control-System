import sqlite3
import json
import os

DB_PATH = "Face_Recognition/database/face_data.db"

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS embeddings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            embedding TEXT NOT NULL,
            image_path TEXT
        )
    ''')
    conn.commit()
    conn.close()


def insert_embedding(name, embedding, image_path):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO embeddings (name, embedding, image_path) VALUES (?, ?, ?)",
              (name, json.dumps(embedding), image_path))
    conn.commit()
    conn.close()


def fetch_all_embeddings():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT name, embedding FROM embeddings")
    data = c.fetchall()
    conn.close()
    
    parsed_data = []
    for name, emb_str in data:
        parsed_data.append({
            'name': name,
            'embedding': json.loads(emb_str)
        })
    return parsed_data