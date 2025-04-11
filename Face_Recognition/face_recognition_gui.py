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
    # ... __init__ and other methods remain unchanged

    def start_video(self):
        if self.cap is not None:
            return

        try:
            self.cap = cv2.VideoCapture(0)  # Open webcam
            if not self.cap.isOpened():
                raise ValueError("Could not open webcam.")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to start video: {str(e)}")
            self.cap = None
            return

        self.is_running = True
        self.update_video()

    def update_video(self):
        if not self.is_running or self.cap is None:
            return

        try:
            ret, frame = self.cap.read()
            if not ret:
                raise ValueError("Failed to read frame from webcam.")
        except Exception as e:
            messagebox.showerror("Error", f"Video error: {str(e)}")
            self.stop_video()
            return

        # Detect and recognize faces in the frame
        try:
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
                    self.result_label.configure(
                        text="No face detected.", foreground="red"
                    )
                else:
                    color = "green" if result != "Unknown" else "orange"
                    self.result_label.configure(
                        text=f"Match: {result} (Score: {round(score, 4)})",
                        foreground=color,
                    )
            else:
                self.result_label.configure(text="No face detected.", foreground="red")
        except Exception as e:
            messagebox.showerror("Error", f"Recognition error: {str(e)}")
            self.result_label.configure(text="Recognition failed.", foreground="red")

        # Display the frame in the GUI
        try:
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame_pil = Image.fromarray(frame_rgb)
            frame_pil.thumbnail((300, 300))
            self.tk_image = ImageTk.PhotoImage(frame_pil)
            self.image_label.configure(image=self.tk_image)
        except Exception as e:
            messagebox.showerror("Error", f"Display error: {str(e)}")
            self.stop_video()
            return

        # Schedule the next frame update
        self.root.after(30, self.update_video)

    def recognize(self):
        if not self.image_path:
            messagebox.showerror("Error", "Please upload an image first.")
            return

        try:
            threshold = self.threshold_var.get()
            result, score = recognize_face(
                self.image_path, db_path=db_path, threshold=threshold
            )
        except Exception as e:
            messagebox.showerror("Error", f"Recognition error: {str(e)}")
            self.result_label.configure(text="Recognition failed.", foreground="red")
            return

        if result == "No face found.":
            self.result_label.configure(text="No face detected.", foreground="red")
            return

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
        try:
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
        except Exception as e:
            messagebox.showerror("Error", f"Logging error: {str(e)}")

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
