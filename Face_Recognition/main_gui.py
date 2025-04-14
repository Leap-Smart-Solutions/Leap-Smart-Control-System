import tkinter as tk
from tkinter import filedialog, messagebox
from tkinter import ttk
import os


class FaceRecognitionApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Smart Home Face Recognition")
        self.root.geometry("800x600")
        self.root.configure(bg="white")

        self.input_mode = tk.StringVar(value="image")
        self.file_path = None

        self.setup_ui()

    def setup_ui(self):
        title = tk.Label(
            self.root,
            text="Smart Home Face Recognition System",
            font=("Helvetica", 18, "bold"),
            bg="white",
        )
        title.pack(pady=20)

        # Input Selection
        mode_frame = tk.Frame(self.root, bg="white")
        mode_frame.pack(pady=10)

        tk.Radiobutton(
            mode_frame,
            text="Image",
            variable=self.input_mode,
            value="image",
            bg="white",
        ).pack(side="left", padx=10)
        tk.Radiobutton(
            mode_frame,
            text="Video",
            variable=self.input_mode,
            value="video",
            bg="white",
        ).pack(side="left", padx=10)
        tk.Radiobutton(
            mode_frame,
            text="Webcam",
            variable=self.input_mode,
            value="webcam",
            bg="white",
        ).pack(side="left", padx=10)

        # File Picker Button
        self.select_btn = tk.Button(
            self.root, text="Select File", command=self.browse_file, bg="#f0f0f0"
        )
        self.select_btn.pack(pady=10)

        # Start Button
        self.start_btn = tk.Button(
            self.root,
            text="Start Recognition",
            command=self.start_recognition,
            bg="#d1ffd1",
        )
        self.start_btn.pack(pady=5)

        # Alerts Button
        self.alert_btn = tk.Button(
            self.root,
            text="Show Today's Alerts",
            command=self.show_alerts,
            bg="#d0e0ff",
        )
        self.alert_btn.pack(pady=5)

        # Exit
        self.exit_btn = tk.Button(
            self.root, text="Exit", command=self.root.quit, bg="#ffcccc"
        )
        self.exit_btn.pack(pady=20)

        # Placeholder for result
        self.result_label = tk.Label(
            self.root, text="", font=("Helvetica", 12), bg="white"
        )
        self.result_label.pack()

    def browse_file(self):
        mode = self.input_mode.get()
        if mode == "image":
            self.file_path = filedialog.askopenfilename(
                filetypes=[("Image files", "*.jpg *.jpeg *.png")]
            )
        elif mode == "video":
            self.file_path = filedialog.askopenfilename(
                filetypes=[("Video files", "*.mp4 *.avi *.mov")]
            )
        if self.file_path:
            self.result_label.config(
                text=f"Selected: {os.path.basename(self.file_path)}"
            )

    def start_recognition(self):
        # Will be linked to detection logic
        messagebox.showinfo(
            "Recognition", f"Starting recognition in {self.input_mode.get()} mode..."
        )

    def show_alerts(self):
        log_path = "logs/recognition_log.csv"
        if os.path.exists(log_path):
            os.system(f"notepad.exe {log_path}")
        else:
            messagebox.showwarning("Log", "No logs found for today.")


if __name__ == "__main__":
    root = tk.Tk()
    app = FaceRecognitionApp(root)
    root.mainloop()
