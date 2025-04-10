import sqlite3
import json

def initialize_db(db_path='database\embeddings.db'):
    conn = sqlite3.connect(db_path)
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


def insert_embedding(name, embedding, image_path=None, db_path='database\embeddings.db'):
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    emb_str = json.dumps(embedding)
    c.execute('INSERT INTO embeddings (name, embedding, image_path) VALUES (?, ?, ?)', (name, emb_str, image_path))
    conn.commit()
    conn.close()


def fetch_all_embeddings(db_path='embeddings/face_embeddings.db'):
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute('SELECT name, embedding FROM embeddings')
    rows = c.fetchall()
    conn.close()
    return [(name, json.loads(embedding)) for name, embedding in rows]
