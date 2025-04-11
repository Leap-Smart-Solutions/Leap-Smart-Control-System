import tkinter as tk
from tkinter import filedialog, messagebox, ttk
from PIL import Image, ImageTk
import os
from datetime import datetime
import csv
import cv2
from face_detection import extract_face
from models.vggface2_model import load_vggface2_model, get_embedding
from utils.db_manager import insert_embedding, fetch_all_embeddings
from recognizer import recognize_face
import torch

# Load the VGGFace2 model
model = load_vggface2_model()
if torch.cuda.is_available():
    model = model.cuda()
    model = model.half()

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
        self.root.geometry("800x600")

        self.image_path = None
        self.cap = None  # For video capture
        self.is_running = False
        self.setup_ui()

    def setup_ui(self):
        # Initialize the frame first
        self.frame = ttk.Frame(self.root, padding=10)
        self.frame.pack(fill=tk.BOTH, expand=True)

        # Threshold slider and label
        self.threshold_label = ttk.Label(
            self.frame, text="↑ More Strict    Threshold (0.8)    More Forgiving ↓"
        )
        self.threshold_label.pack(pady=5)

        self.threshold_var = tk.DoubleVar(value=0.8)
        self.threshold_slider = ttk.Scale(
            self.frame,
            from_=0.5,
            to=0.95,
            orient="horizontal",
            variable=self.threshold_var,
            command=lambda val: self.threshold_label.configure(
                text=f"↑ More Strict    Threshold ({float(val):.2f})    More Forgiving ↓"
            ),
        )
        self.threshold_slider.pack()

        self.upload_button = ttk.Button(
            self.frame, text="📁 Upload Image", command=self.upload_image
        )
        self.upload_button.pack(pady=5)

        self.start_video_button = ttk.Button(
            self.frame, text="🎥 Start Video", command=self.start_video
        )
        self.start_video_button.pack(pady=5)

        self.stop_video_button = ttk.Button(
            self.frame, text="⏹ Stop Video", command=self.stop_video
        )
        self.stop_video_button.pack(pady=5)

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

    def start_video(self):
        if self.cap is not None:
            return

        self.cap = cv2.VideoCapture(0)  # Open webcam
        if not self.cap.isOpened():
            messagebox.showerror("Error", "Could not open webcam.")
            self.cap = None
            return

        self.is_running = True
        self.update_video()

    def stop_video(self):
        self.is_running = False
        if self.cap is not None:
            self.cap.release()
            self.cap = None
        self.image_label.configure(image="")
        self.result_label.configure(text="")

    def update_video(self):
        if not self.is_running or self.cap is None:
            return

        ret, frame = self.cap.read()
        if not ret:
            self.stop_video()
            return

        # Detect and recognize faces in the frame
        face = extract_face(frame)  # Uses YOLOv8
        if face is not None:
            # Save the frame temporarily to recognize it
            temp_path = "temp_frame.jpg"
            cv2.imwrite(temp_path, frame)
            threshold = self.threshold_var.get()
            result, score = recognize_face(
                temp_path, db_path=db_path, threshold=threshold
            )
            os.remove(temp_path)

            # Display the result
            if result == "No face found.":
                self.result_label.configure(text="No face detected.", foreground="red")
            else:
                color = "green" if result != "Unknown" else "orange"
                self.result_label.configure(
                    text=f"Match: {result} (Score: {round(score, 4)})",
                    foreground=color,
                )

        # Display the frame in the GUI
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame_pil = Image.fromarray(frame_rgb)
        frame_pil.thumbnail((300, 300))
        self.tk_image = ImageTk.PhotoImage(frame_pil)
        self.image_label.configure(image=self.tk_image)

        # Schedule the next frame update
        self.root.after(30, self.update_video)  # Update every 30ms (~33 FPS)

    def recognize(self):
        if not self.image_path:
            messagebox.showerror("Error", "Please upload an image first.")
            return

        # Use recognize_face from recognizer.py (YOLOv8 for detection, VGGFace2 for recognition)
        threshold = self.threshold_var.get()
        result, score = recognize_face(
            self.image_path, db_path=db_path, threshold=threshold
        )

        if result == "No face found.":
            self.result_label.configure(text="No face detected.", foreground="red")
            return

        # Set the result and color based on the recognition outcome
        if result == "Unknown":
            final_result = "Unknown"
            color = "orange"
        else:
            final_result = result
            color = "green"

        self.result_label.configure(
            text=f"Match: {final_result} (Score: {round(score, 4)})",
            foreground=color,
        )

        # Save to logs
        with open(log_path, "a", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(
                [
                    datetime.now().strftime("%Y-%m-d %H:%M:%S"),
                    os.path.basename(self.image_path),
                    final_result,
                    round(score, 4),
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
        if torch.cuda.is_available():
            emb = emb.cuda().half()
        insert_embedding(name, emb.cpu().numpy().tolist(), file_path, db_path)
        messagebox.showinfo("Success", f"{name} has been added to the database!")


if __name__ == "__main__":
    root = tk.Tk()
    app = FaceRecognitionApp(root)
    root.mainloop()
