# Face Recognition Project

import os
import numpy as np
import cv2
from deepface import DeepFace
import pandas as pd
import sqlite3


class FaceRecognitionSystem:
    def __init__(self, database_path="face_database.db"):
        """
        Initialize the Face Recognition System

        Args:
            database_path (str): Path to the SQLite database for storing face embeddings
        """
        self.database_path = database_path
        self.setup_database()

    def setup_database(self):
        """
        Create SQLite database to store face embeddings and user information
        """
        conn = sqlite3.connect(self.database_path)
        cursor = conn.cursor()

        # Create tables for storing face information
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                image_path TEXT NOT NULL
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS face_embeddings (
                user_id INTEGER,
                embedding BLOB,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        """)

        conn.commit()
        conn.close()

    def register_face(self, name, image_path):
        """
        Register a new face in the database

        Args:
            name (str): Name of the person
            image_path (str): Path to the image file

        Returns:
            bool: True if registration successful, False otherwise
        """
        try:
            # Detect and extract face embedding
            embedding = DeepFace.represent(
                img_path=image_path, model_name="Facenet512", enforce_detection=True
            )[0]["embedding"]

            # Connect to database
            conn = sqlite3.connect(self.database_path)
            cursor = conn.cursor()

            # Insert user
            cursor.execute(
                "INSERT INTO users (name, image_path) VALUES (?, ?)", (name, image_path)
            )
            user_id = cursor.lastrowid

            # Insert embedding
            cursor.execute(
                "INSERT INTO face_embeddings (user_id, embedding) VALUES (?, ?)",
                (user_id, np.array(embedding).tobytes()),
            )

            conn.commit()
            conn.close()

            print(f"Successfully registered {name}")
            return True

        except Exception as e:
            print(f"Error registering face: {e}")
            return False

    def recognize_face(self, image_path, threshold=0.4):
        """
        Recognize a face from the database

        Args:
            image_path (str): Path to the image to recognize
            threshold (float): Similarity threshold for recognition

        Returns:
            dict: Recognition results
        """
        try:
            # Get all registered embeddings
            conn = sqlite3.connect(self.database_path)
            cursor = conn.cursor()

            cursor.execute("""
                SELECT users.name, face_embeddings.embedding 
                FROM users 
                JOIN face_embeddings ON users.id = face_embeddings.user_id
            """)

            registered_faces = cursor.fetchall()
            conn.close()

            # Detect face in input image
            input_embedding = DeepFace.represent(
                img_path=image_path, model_name="Facenet512", enforce_detection=True
            )[0]["embedding"]

            # Compare embeddings
            for name, stored_embedding in registered_faces:
                stored_embedding = np.frombuffer(stored_embedding, dtype=np.float64)
                distance = np.linalg.norm(np.array(input_embedding) - stored_embedding)

                if distance < threshold:
                    return {"recognized": True, "name": name, "distance": distance}

            return {"recognized": False}

        except Exception as e:
            print(f"Recognition error: {e}")
            return {"recognized": False, "error": str(e)}

    def detect_faces_in_image(self, image_path):
        """
        Detect and draw rectangles around faces in an image

        Args:
            image_path (str): Path to the image

        Returns:
            numpy.ndarray: Image with detected faces
        """
        try:
            # Read the image
            image = cv2.imread(image_path)

            # Detect faces
            faces = DeepFace.extract_faces(img_path=image_path, enforce_detection=True)

            # Draw rectangles around detected faces
            for face in faces:
                x, y, w, h = (
                    face["facial_area"]["x"],
                    face["facial_area"]["y"],
                    face["facial_area"]["w"],
                    face["facial_area"]["h"],
                )
                cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)

            return image

        except Exception as e:
            print(f"Face detection error: {e}")
            return None
