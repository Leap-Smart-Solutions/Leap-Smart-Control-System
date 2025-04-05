# Ring Development – Leap Smart Control System

This repository contains the development code for the **Leap Smart Control System - Ring Module**, using the ESP-01 (ESP8266) microcontroller and the MPU6050 sensor. The project includes various communication methods like Firebase and local WebSocket servers.

## 🔧 Files Overview

| File Name               | Description |
|------------------------|-------------|
| **ESP01_MPU_Firebase.ino** | Sends MPU6050 data to Firebase using Wi-Fi connection. |
| **ESP01_MPU_Local.ino**    | Streams MPU6050 data over WebSocket locally and serves a live webpage. |
| **ESP01_MPU_Lib.ino**      | Demonstrates use of MPU6050 sensor via I2C with basic data output (testing or library functionality). |

## 📦 Features

- Real-time data acquisition from MPU6050 (accelerometer + gyroscope).
- Web-based dashboard with live data updates via WebSocket.
- CSV download support for sensor data logging.
- Firebase integration for cloud data storage.
- Clean modular structure for both local and cloud-based communication.

## 📲 Hardware Required

- ESP-01 / ESP8266 Module
- MPU6050 Sensor
- USB-to-Serial Adapter (for flashing)
- 3.3V Power Supply

## 🧠 How It Works

1. **Local Mode (`ESP01_MPU_Local.ino`)**
   - Connects to Wi-Fi.
   - Hosts a simple HTML page with JavaScript.
   - Streams MPU6050 data live via WebSocket.
   - Allows CSV download of logged sensor data.

2. **Cloud Mode (`ESP01_MPU_Firebase.ino`)**
   - Connects to Firebase Realtime Database.
   - Uploads MPU6050 data periodically for remote monitoring.

3. **Library Demo (`ESP01_MPU_Lib.ino`)**
   - Outputs sensor data to Serial Monitor for quick testing/debugging.

## 🚀 Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/<your-username>/Leap-Smart-Control-System.git
