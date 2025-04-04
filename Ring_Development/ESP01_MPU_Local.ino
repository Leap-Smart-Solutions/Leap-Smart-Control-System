#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <Wire.h>

// Wi-Fi credentials
const char* ssid = "Realme";
const char* pass = "99999999";

// I2C address of the MPU-6050 (default is 0x68)
const int MPU = 0x68;

// Variables to store MPU6050 data
float AcX, AcY, AcZ, GyX, GyY, GyZ;

void setup() {
  // Start serial communication
  Serial.begin(115200);
  while (!Serial) {
    delay(10); // Wait for Serial to initialize
  }

  // Connect to Wi-Fi
  Serial.print("Connecting to Wi-Fi...");
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\nWi-Fi connected");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  // Initialize I2C communication
  Wire.begin(2, 0); // SDA on GPIO2, SCL on GPIO0 (default for ESP-01S)
  
  
  // Initialize MPU6050
  Wire.beginTransmission(MPU);
  Wire.write(0x6B); // Power management register
  Wire.write(0);    // Wake up the MPU6050
  Wire.endTransmission(true);
  Serial.println("MPU6050 initialized");
}

void loop() {
  // Read raw data from MPU6050
  Wire.beginTransmission(MPU);
  Wire.write(0x3B); // Starting register for accelerometer data
  Wire.endTransmission(false);
  Wire.requestFrom(MPU, 14, true); // Request 14 bytes of data

  AcX = Wire.read(); // Accelerometer X-axis
  AcY = Wire.read(); // Accelerometer Y-axis
  AcZ = Wire.read(); // Accelerometer Z-axis
  Wire.read(); Wire.read();             // Skip temperature data
  GyX = Wire.read() << 8 | Wire.read(); // Gyroscope X-axis
  GyY = Wire.read() << 8 | Wire.read(); // Gyroscope Y-axis
  GyZ = Wire.read() << 8 | Wire.read(); // Gyroscope Z-axis

  // Print normalized values
  Serial.print("Accel (m/s²): ");
  Serial.print("X: "); Serial.print(AcX);
  Serial.print(" Y: "); Serial.print(AcY);
  Serial.print(" Z: "); Serial.println(AcZ);

  Serial.print("Gyro (°/s): ");
  Serial.print("X: "); Serial.print(GyX);
  Serial.print(" Y: "); Serial.print(GyY);
  Serial.print(" Z: "); Serial.println(GyZ);

  delay(500); // Delay to reduce serial output frequency
}
