# Leap IoT Ecosystem

This project explores the **Leap IoT ecosystem**, focusing on the integration of gesture-based smart control and health monitoring technologies. It features four primary IoT devices: **Smart Ring**, **Smart Switch**, and **Live Stream Camera**—each playing a unique role in enhancing smart home interactivity and security.

---

## 📦 Devices Overview

### 🔘 Smart Ring

**Use Case**:  
A wearable control device that enables gesture-based management of smart home elements such as smart switches and smart door locks.

**Hardware Components**:
- **ESP-01s**: Wi-Fi-enabled microcontroller, ideal for compact devices.
- **MPU-6050**: 6-axis motion sensor for accurate gesture detection.
- **Li-Po Battery**: Lightweight, rechargeable power source suitable for wearables.

**Software**:
- Developed in **C++** using **Arduino IDE**.
- Uses **Firebase ESP Client Library** for real-time database communication over Wi-Fi.

---

### 💡 Smart Switch

**Use Case**:  
Enables users to control electrical appliances via mobile app, web dashboard, Smart Ring, or manual button.

**Hardware Components**:
- **ESP-01s**: Microcontroller for Firebase communication and appliance control.
- **Relay**: Electrically operated switch for high-voltage control.
- **Custom PCB**: Organized, compact circuit layout.
- **Push Button**: Manual override for local control.

**Software**:
- Developed in **C++** using **Arduino IDE**.
- Uses **Firebase ESP Client Library** for cloud-based control and monitoring.

---

### 📷 Live Stream Camera

**Use Case**:  
Streams video to a facial recognition system for real-time surveillance and monitoring.

**Hardware Components**:
- **ESP32-CAM**: Wi-Fi microcontroller with built-in OV2640 camera and microSD support.
- **FTDI Programmer**: Facilitates USB-to-serial communication for flashing firmware.

**Software Setup**:
1. Install **Arduino IDE**.
2. Add ESP32 board package via Boards Manager.
3. Install required libraries (e.g., ESP32 library).
4. Select **AI-Thinker ESP32-CAM** as the board.
5. Connect via **FTDI programmer** and upload sketch in flashing mode.

---

## 📡 Connectivity & Cloud Integration

All devices leverage **Firebase** for real-time communication, data storage, and interaction within the smart ecosystem. The Firebase ESP Client Library ensures efficient synchronization across all connected devices.

---

## ⚙️ Development Environment

- **Arduino IDE**
- **C++**
- **Firebase ESP Client Library**
- **ESP32 / ESP-01s Platforms**

---

## 📁 Project Structure

```
/Leap-IoT/
├── SmartRing/
├── SmartSwitch/
├── LiveStreamCamera/
└── README.md
```

Each folder contains the source code, circuit diagrams, and setup instructions for the respective IoT device.

---

## 🤝 Contributors

- Designed and developed by the Leap IoT Team.

---

## 📜 License

This project is licensed under the MIT License.
