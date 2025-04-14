import tkinter as tk
from tkinter import filedialog, messagebox
from PIL import ImageTk, Image
import datetime
import os
import subprocess
import threading


class FaceRecognitionApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Smart Home Face Recognition System")
        self.root.geometry("500x400")
        self.root.configure(bg="white")

        self.mode_var = tk.StringVar(value="image")
        self.file_path = None

        tk.Label(
            root,
            text="Smart Home Face Recognition System",
            font=("Helvetica", 16, "bold"),
            bg="white",
        ).pack(pady=20)

        mode_frame = tk.Frame(root, bg="white")
        mode_frame.pack()

        tk.Radiobutton(
            mode_frame, text="Image", variable=self.mode_var, value="image", bg="white"
        ).grid(row=0, column=0, padx=10)
        tk.Radiobutton(
            mode_frame, text="Video", variable=self.mode_var, value="video", bg="white"
        ).grid(row=0, column=1, padx=10)
        tk.Radiobutton(
            mode_frame,
            text="Webcam",
            variable=self.mode_var,
            value="webcam",
            bg="white",
        ).grid(row=0, column=2, padx=10)

        tk.Button(root, text="Select File", command=self.select_file).pack(pady=10)
        tk.Button(
            root,
            text="Start Recognition",
            bg="lightgreen",
            command=self.start_recognition,
        ).pack(pady=5)
        tk.Button(root, text="Show Today's Alerts", command=self.show_alerts).pack(
            pady=5
        )

    def select_file(self):
        mode = self.mode_var.get()
        filetypes = (
            [("Image files", "*.jpg *.png")]
            if mode == "image"
            else [("Video files", "*.mp4 *.avi")]
        )
        self.file_path = filedialog.askopenfilename(filetypes=filetypes)
        if self.file_path:
            messagebox.showinfo("File Selected", f"Selected file:\n{self.file_path}")

    def start_recognition(self):
        mode = self.mode_var.get()
        if mode in ["image", "video"] and not self.file_path:
            messagebox.showwarning("No File", "Please select a file first.")
            return

        messagebox.showinfo("Recognition", f"Starting recognition in {mode} mode...")
        threading.Thread(target=self.run_recognition).start()

    def run_recognition(self):
        mode = self.mode_var.get()
        cmd = ["python", "realtime_recognition.py", "--mode", mode]
        if mode != "webcam":
            cmd += ["--source", self.file_path]
        subprocess.run(cmd)

    def show_alerts(self):
        today = datetime.datetime.now().strftime("%Y-%m-%d")
        log_file = os.path.join("logs", "recognition_log.csv")
        if not os.path.exists(log_file):
            messagebox.showinfo("No Logs", "No alerts logged yet.")
            return

        alerts = []
        with open(log_file, "r") as f:
            for line in f:
                if line.startswith(today):
                    alerts.append(line.strip())

        if alerts:
            alert_window = tk.Toplevel(self.root)
            alert_window.title("Today's Alerts")
            alert_window.geometry("400x300")
            text = tk.Text(alert_window, wrap=tk.WORD)
            text.insert(tk.END, "\n".join(alerts))
            text.pack(expand=True, fill="both")
        else:
            messagebox.showinfo("No Alerts", "No alerts found for today.")


if __name__ == "__main__":
    root = tk.Tk()
    app = FaceRecognitionApp(root)
    root.mainloop()
