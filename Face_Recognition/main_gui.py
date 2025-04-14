# main_gui.py

import tkinter as tk
from tkinter import filedialog, messagebox
from PIL import Image, ImageTk
import cv2
import os
import datetime
import numpy as np

from face_recognizer import recognize_faces_from_image
from db_manager import fetch_all_embeddings
from yolo_face_detector import YOLOFaceDetector
from utils.sound import play_alarm_sound
from utils.save import save_unknown_face
from utils.logs import save_alert_log, get_today_logs


class FaceRecognitionApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Leap Smart Control System")
        self.root.configure(bg="white")

        self.detector = YOLOFaceDetector(confidence=0.45)

        self.image_label = tk.Label(self.root, bg="white")
        self.image_label.pack(pady=10)

        btn_frame = tk.Frame(self.root, bg="white")
        btn_frame.pack(pady=10)

        tk.Button(btn_frame, text="Upload Image", command=self.upload_image).grid(
            row=0, column=0, padx=5
        )
        tk.Button(btn_frame, text="Use Webcam", command=self.use_webcam).grid(
            row=0, column=1, padx=5
        )
        tk.Button(btn_frame, text="Upload Video", command=self.upload_video).grid(
            row=0, column=2, padx=5
        )
        tk.Button(
            btn_frame, text="Today's Alerts", command=self.show_todays_alerts
        ).grid(row=0, column=3, padx=5)

        self.status_label = tk.Label(
            self.root, text="Status: Ready", bg="white", fg="green"
        )
        self.status_label.pack(pady=5)

    def show_image(self, image):
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = Image.fromarray(image)
        image = image.resize((600, 400))
        photo = ImageTk.PhotoImage(image)
        self.image_label.config(image=photo)
        self.image_label.image = photo

    def upload_image(self):
        file_path = filedialog.askopenfilename(
            filetypes=[("Image files", "*.jpg *.png *.jpeg")]
        )
        if not file_path:
            return

        image = cv2.imread(file_path)
        face_crops, boxes = self.detector.detect_faces(image)

        if not face_crops:
            self.status_label.config(text="No face detected.", fg="red")
            return

        labels = []
        known_embeddings = fetch_all_embeddings()
        for i, face in enumerate(face_crops):
            label, is_known = recognize_faces_from_image(face, known_embeddings)
            labels.append(label)
            if not is_known:
                save_unknown_face(face)
                save_alert_log(label)
                play_alarm_sound()

        image = self.detector.draw_boxes(image, boxes, labels)
        self.show_image(image)
        self.status_label.config(text="Detection complete.", fg="blue")

    def use_webcam(self):
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            messagebox.showerror("Error", "Webcam not accessible.")
            return

        known_embeddings = fetch_all_embeddings()
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            face_crops, boxes = self.detector.detect_faces(frame)
            labels = []

            for face in face_crops:
                label, is_known = recognize_faces_from_image(face, known_embeddings)
                labels.append(label)
                if not is_known:
                    save_unknown_face(face)
                    save_alert_log(label)
                    play_alarm_sound()

            frame = self.detector.draw_boxes(frame, boxes, labels)
            cv2.imshow("Webcam Face Recognition", frame)

            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

        cap.release()
        cv2.destroyAllWindows()

    def upload_video(self):
        file_path = filedialog.askopenfilename(
            filetypes=[("Video files", "*.mp4 *.avi *.mov")]
        )
        if not file_path:
            return

        cap = cv2.VideoCapture(file_path)
        known_embeddings = fetch_all_embeddings()

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            face_crops, boxes = self.detector.detect_faces(frame)
            labels = []

            for face in face_crops:
                label, is_known = recognize_faces_from_image(face, known_embeddings)
                labels.append(label)
                if not is_known:
                    save_unknown_face(face)
                    save_alert_log(label)
                    play_alarm_sound()

            frame = self.detector.draw_boxes(frame, boxes, labels)
            cv2.imshow("Video Face Recognition", frame)

            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

        cap.release()
        cv2.destroyAllWindows()

    def show_todays_alerts(self):
        alerts = get_today_logs()
        if not alerts:
            messagebox.showinfo("Today's Alerts", "No alerts today.")
            return
        alert_text = "\n".join(alerts)
        messagebox.showinfo("Today's Alerts", alert_text)


if __name__ == "__main__":
    root = tk.Tk()
    app = FaceRecognitionApp(root)
    root.mainloop()
