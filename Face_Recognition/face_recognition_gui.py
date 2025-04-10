import tkinter as tk
from tkinter import filedialog, messagebox, ttk
from PIL import Image, ImageTk
import os
import numpy as np
from datetime import datetime
import csv
import json
from face_detection import extract_face
from models.vggface2_model import load_vggface2_model, get_embedding
from utils.db_manager import insert_embedding, fetch_all_embeddings
from sklearn.metrics.pairwise import cosine_similarity

model = load_vggface2_model()
db_path = "database/embeddings.db"
log_path = "logs/recognition_log.csv"

if not os.path.exists("logs"):
    os.makedirs("logs")


class FaceRecognitionApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Face ID - Control System")
        self.root.geometry("600x500")

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

        self.threshold_label = ttk.Label(
            self.frame, text="↑ More Strict    Threshold (0.5)    More Forgiving ↓"
        )
        self.threshold_label.pack(pady=5)

        self.threshold_slider = ttk.Scale(
            self.frame,
            from_=0.3,
            to=0.9,
            orient="horizontal",
            command=self.update_threshold_label,
        )
        self.threshold_slider.set(0.5)
        self.threshold_slider.pack()

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

    def update_threshold_label(self, val):
        pass  # Already has text above slider

    def recognize(self):
        if not self.image_path:
            messagebox.showerror("Error", "Please upload an image first.")
            return

        face = extract_face(self.image_path)
        if face is None:
            self.result_label.configure(text="No face detected.", foreground="red")
            return

        emb = get_embedding(model, face)
        embeddings = fetch_all_embeddings(db_path)

        best_match = None
        best_score = -1
        threshold = float(self.threshold_slider.get())

        for name, stored_emb in embeddings:
            score = cosine_similarity([emb], [np.array(stored_emb)])[0][0]
            if score > best_score:
                best_score = score
                best_match = name

        result = best_match if best_score > threshold else "Unknown"
        self.result_label.configure(
            text=f"Match: {result}",
            foreground="green" if result != "Unknown" else "orange",
        )

        with open(log_path, "a", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(
                [
                    datetime.now(),
                    os.path.basename(self.image_path),
                    result,
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
