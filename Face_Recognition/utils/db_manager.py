import sqlite3
import json
import csv
import os
from datetime import datetime


def initialize_db(db_path="database/embeddings.db"):
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS embeddings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            embedding TEXT NOT NULL,
            image_path TEXT
        )
    """)
    conn.commit()
    conn.close()


def insert_embedding(
    name, embedding, image_path=None, db_path="database/embeddings.db"
):
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    emb_str = json.dumps(embedding)
    c.execute(
        "INSERT INTO embeddings (name, embedding, image_path) VALUES (?, ?, ?)",
        (name, emb_str, image_path),
    )
    conn.commit()
    conn.close()


def fetch_all_embeddings(db_path="database/embeddings.db"):
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute("SELECT name, embedding FROM embeddings")
    rows = c.fetchall()
    conn.close()
    return [(name, json.loads(embedding)) for name, embedding in rows]


def get_all_embeddings(db_path="database/embeddings.db"):
    embeddings = fetch_all_embeddings(db_path)
    if not embeddings:
        return [], []
    labels = [name for name, _ in embeddings]
    known_embeddings = [emb for _, emb in embeddings]
    return known_embeddings, labels


def log_recognition_event(name, log_path="logs/recognition_log.csv"):
    os.makedirs(os.path.dirname(log_path), exist_ok=True)
    with open(log_path, "a", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(
            [datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "N/A", name, "N/A"]
        )
