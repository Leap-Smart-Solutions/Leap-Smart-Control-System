import tkinter as tk
from tkinter import filedialog, messagebox, ttk
from PIL import Image, ImageTk
import os
import numpy as np
from datetime import datetime
import csv
from Face_Recognition.Archive.face_detection import extract_face
from models.vggface2_model import load_vggface2_model, get_embedding
from utils.db_manager import insert_embedding, fetch_all_embeddings
from sklearn.metrics.pairwise import cosine_similarity

model = load_vggface2_model()
db_path = "database/embeddings.db"
log_path = "logs/recognition_log.csv"

# Ensure the logs directory exists
if not os.path.exists("logs"):
    os.makedirs("logs")

# Verify the database path
if not os.path.exists(db_path):
    print(
        f"[ERROR] Database file not found at {db_path}. Please ensure the database is created and embeddings are stored."
    )
else:
    print(f"[INFO] Database found at {db_path}.")


class FaceRecognitionApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Face ID - Control System")
        self.root.geometry("600x500")

        SELF_THRESHOLD = 0.8  # Fixed threshold (can be adjusted as needed)

        self.image_path = None
        self.setup_ui()

    def setup_ui(self):
        self.frame = ttk.Frame(self.root, padding=10)
        self.frame.pack(fill=tk.BOTH, expand=True)

        self.upload_button = ttk.Button(
            self.frame, text="📁 Upload Image", command=self.upload_image
        )
        self.upload_button.pack(pady=10)

        self.image_label = ttk.Label(self.frame)
        self.image_label.pack(pady=5)

        self.result_label = ttk.Label(self.frame, text="", font=("Helvetica", 14))
        self.result_label.pack(pady=10)

        self.recognize_button = ttk.Button(
            self.frame, text="🔍 Recognize Face", command=self.recognize
        )
        self.recognize_button.pack(pady=5)

        self.try_again_button = ttk.Button(
            self.frame, text="🔁 Try Another Image", command=self.reset_ui
        )
        self.try_again_button.pack(pady=5)

        self.add_person_button = ttk.Button(
            self.frame, text="➕ Add Person to DB", command=self.add_new_person
        )
        self.add_person_button.pack(pady=5)

    def upload_image(self):
        file_path = filedialog.askopenfilename()
        if file_path:
            self.image_path = file_path
            image = Image.open(file_path)
            image.thumbnail((300, 300))
            self.tk_image = ImageTk.PhotoImage(image)
            self.image_label.configure(image=self.tk_image)
            self.result_label.configure(text="")

    def recognize(self):
        if not self.image_path:
            messagebox.showerror("Error", "Please upload an image first.")
            return

        face = extract_face(self.image_path)
        if face is None:
            self.result_label.configure(text="No face detected.", foreground="red")
            return

        # Adapted from recognizer.py
        threshold = 0.8  # Fixed threshold (same as the default in recognizer.py)
        new_emb = get_embedding(model, face)
        embeddings = fetch_all_embeddings(db_path)

        # Debug: Check if embeddings are loaded
        if not embeddings:
            print(
                "[ERROR] No embeddings found in the database. Please add persons to the database."
            )
            self.result_label.configure(
                text="No embeddings in database.", foreground="red"
            )
            return

        print(f"[INFO] Found {len(embeddings)} embeddings in the database.")
        for name, stored_emb in embeddings:
            print(
                f"[DEBUG] Embedding for {name}: {stored_emb[:5]}..."
            )  # Print first 5 values for brevity

        best_match = None
        best_score = -1

        for name, stored_emb in embeddings:
            try:
                score = cosine_similarity([new_emb], [np.array(stored_emb)])[0][0]
                print(f"[Similarity] {name}: {score:.4f}")
                if score > best_score:
                    best_score = score
                    best_match = name
            except Exception as e:
                print(f"[ERROR] Failed to compute similarity for {name}: {e}")
                continue

        # Determine the result based on the threshold
        if best_score >= threshold:
            final_result = best_match
            color = "green"
        else:
            final_result = "Unknown"
            color = "orange"

        self.result_label.configure(
            text=f"Match: {final_result} (Score: {round(best_score, 4)})",
            foreground=color,
        )

        # Save to logs
        with open(log_path, "a", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(
                [
                    datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    os.path.basename(self.image_path),
                    final_result,
                    round(best_score, 4),
                ]
            )

    def reset_ui(self):
        self.image_label.configure(image="")
        self.image_path = None
        self.result_label.configure(text="")

    def add_new_person(self):
        name = tk.simpledialog.askstring("Add Person", "Enter name:")
        if not name:
            return

        file_path = filedialog.askopenfilename()
        if not file_path:
            return

        face = extract_face(file_path)
        if face is None:
            messagebox.showerror("Error", "No face detected in the image.")
            return

        emb = get_embedding(model, face)
        insert_embedding(name, emb.tolist(), file_path, db_path)
        messagebox.showinfo("Success", f"{name} has been added to the database!")


if __name__ == "__main__":
    root = tk.Tk()
    app = FaceRecognitionApp(root)
    root.mainloop()
