import serial
import time
import json
import requests
import numpy as np
from src.utils.logger import get_logger

logger = get_logger(__name__)

# إعدادات الاتصال بـ IMU
PORT = "COM3"  
BAUD_RATE = 9600
API_URL = "http://localhost:5000/predict"

# عدد القراءات اللي هنبعتها مرة واحدة
WINDOW_SIZE = 100

def read_imu_data(serial_conn, window_size=100):
    data = []
    while len(data) < window_size:
        try:
            line = serial_conn.readline().decode("utf-8").strip()
            if line:
                values = list(map(float, line.split(",")))  # Assuming 6 values per line
                if len(values) == 6:
                    data.append(values)
        except Exception as e:
            logger.warning(f"Read error: {e}")
    return data

def send_to_api(data):
    try:
        payload = {"imu_data": data}
        response = requests.post(API_URL, json=payload)
        if response.status_code == 200:
            gesture = response.json().get("gesture")
            logger.info(f"Predicted Gesture: {gesture}")
        else:
            logger.warning(f"Server Error: {response.text}")
    except Exception as e:
        logger.error(f"Failed to send to API: {e}")

def stream_and_predict():
    try:
        ser = serial.Serial(PORT, BAUD_RATE, timeout=1)
        logger.info("Serial connection established.")
        time.sleep(2)  # خلي السنسور يستقر

        while True:
            imu_window = read_imu_data(ser, WINDOW_SIZE)
            send_to_api(imu_window)

    except Exception as e:
        logger.error(f"Failed to start streaming: {e}")

if __name__ == "__main__":
    stream_and_predict()
