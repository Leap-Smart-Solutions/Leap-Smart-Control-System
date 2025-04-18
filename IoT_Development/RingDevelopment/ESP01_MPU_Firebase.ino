#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <Wire.h>
#include <Firebase_ESP_Client.h> 
#include "addons/TokenHelper.h" 
#include "addons/RTDBHelper.h" 

// Wi-Fi credentials
const char* ssid = "Realme";
const char* pass = "99999999";

// Firebase project credentials 
#define API_KEY "" 
#define DATABASE_URL "https://leap-smart-band-default-rtdb.firebaseio.com/" 
 
// Firebase objects 
FirebaseData fbdo; 
FirebaseAuth auth; 
FirebaseConfig config; 
bool signupOK = false; 
 
unsigned long sendDataPrevMillis = 0; 

// I2C address of the MPU-6050 (default is 0x68)
const int MPU = 0x68;

// MPU6050 sensitivity coefficients
const float accelCoefficient = 16384.0; // Accelerometer sensitivity (±2g)
const float gyroCoefficient = 131.0;   // Gyroscope sensitivity (±250°/s)

// Variables to store MPU6050 data
int16_t AcX, AcY, AcZ, GyX, GyY, GyZ;
float AcXNorm, AcYNorm, AcZNorm, GyXNorm, GyYNorm, GyZNorm;

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
  Wire.begin(0, 2); // SDA on GPIO0, SCL on GPIO2 (default for ESP-01S)
  
  
  // Initialize MPU6050
  Wire.beginTransmission(MPU);
  Wire.write(0x6B); // Power management register
  Wire.write(0);    // Wake up the MPU6050
  Wire.endTransmission(true);
  Serial.println("MPU6050 initialized");

  // Firebase setup 
  config.api_key = API_KEY; 
  config.database_url = DATABASE_URL; 
  config.token_status_callback = tokenStatusCallback; 
  if (Firebase.signUp(&config, &auth, "", "")) { 
    Serial.println("Firebase signup successful"); 
    signupOK = true; 
  } else { 
    Serial.printf("Signup failed: %s\n", config.signer.signupError.message.c_str()); 
  } 
  Firebase.begin(&config, &auth); 
  Firebase.reconnectWiFi(true); 
}

void loop() {
  // Read raw data from MPU6050
  Wire.beginTransmission(MPU);
  Wire.write(0x3B); // Starting register for accelerometer data
  Wire.endTransmission(false);
  Wire.requestFrom(MPU, 14, true); // Request 14 bytes of data

  AcX = Wire.read() << 8 | Wire.read(); // Accelerometer X-axis
  AcY = Wire.read() << 8 | Wire.read(); // Accelerometer Y-axis
  AcZ = Wire.read() << 8 | Wire.read(); // Accelerometer Z-axis
  Wire.read(); Wire.read();             // Skip temperature data
  GyX = Wire.read() << 8 | Wire.read(); // Gyroscope X-axis
  GyY = Wire.read() << 8 | Wire.read(); // Gyroscope Y-axis
  GyZ = Wire.read() << 8 | Wire.read(); // Gyroscope Z-axis

  // Normalize data
  AcXNorm = AcX / accelCoefficient;
  AcYNorm = AcY / accelCoefficient;
  AcZNorm = AcZ / accelCoefficient;
  GyXNorm = GyX / gyroCoefficient;
  GyYNorm = GyY / gyroCoefficient;
  GyZNorm = GyZ / gyroCoefficient;


  // Check Firebase connection every 10 ms 
  if (millis() - sendDataPrevMillis > 10 || sendDataPrevMillis == 0) { 
    sendDataPrevMillis = millis(); 
     
    // If Firebase is ready, check hand position and update LED and Firebase 
    if (Firebase.ready() && signupOK) { 
      
      // Send IMU data to Firebase paths 
      Firebase.RTDB.setFloat(&fbdo, "/IMU_Data/0/Imu0_linear_accleration_x", AcXNorm); 
      Firebase.RTDB.setFloat(&fbdo, "/IMU_Data/0/Imu0_linear_accleration_y", AcYNorm); 
      Firebase.RTDB.setFloat(&fbdo, "/IMU_Data/0/Imu0_linear_accleration_z", AcZNorm); 
      Firebase.RTDB.setFloat(&fbdo, "/IMU_Data/0/Imu0_orientation_x", GyXNorm); 
      Firebase.RTDB.setFloat(&fbdo, "/IMU_Data/0/Imu0_orientation_y", GyYNorm); 
      Firebase.RTDB.setFloat(&fbdo, "/IMU_Data/0/Imu0_orientation_z", GyZNorm); 
      Firebase.RTDB.setInt(&fbdo, "/IMU_Data/0/timestamp", millis()); 

      delay(10);
      // Send IMU data to Firebase paths 
      Firebase.RTDB.setFloat(&fbdo, "/IMU_Data/1/Imu0_linear_accleration_x", AcXNorm); 
      Firebase.RTDB.setFloat(&fbdo, "/IMU_Data/1/Imu0_linear_accleration_y", AcYNorm); 
      Firebase.RTDB.setFloat(&fbdo, "/IMU_Data/1/Imu0_linear_accleration_z", AcZNorm); 
      Firebase.RTDB.setFloat(&fbdo, "/IMU_Data/1/Imu0_orientation_x", GyXNorm); 
      Firebase.RTDB.setFloat(&fbdo, "/IMU_Data/1/Imu0_orientation_y", GyYNorm); 
      Firebase.RTDB.setFloat(&fbdo, "/IMU_Data/1/Imu0_orientation_z", GyZNorm); 
      Firebase.RTDB.setInt(&fbdo, "/IMU_Data/1/timestamp", millis());
 
      // // Retrieve and print Firebase value foryyyuuuuuuuuuuuuuuuu  verification 
      // if (Firebase.RTDB.getString(&fbdo, "/Door/stat")) { 
      //   Serial.print("Firebase Door status: "); 
      //   Serial.println(fbdo.to<String>()); 
      // } else { 
      //   Serial.print("Failed to get Firebase value: "); 
      //   Serial.println(fbdo.errorReason()); 
      // } 
    } 
  }



  // Print normalized values
  Serial.print("Accel (m/s²): ");
  Serial.print("X: "); Serial.print(AcXNorm);
  Serial.print(" Y: "); Serial.print(AcYNorm);
  Serial.print(" Z: "); Serial.println(AcZNorm);

  Serial.print("Gyro (°/s): ");
  Serial.print("X: "); Serial.print(GyXNorm);
  Serial.print(" Y: "); Serial.print(GyYNorm);
  Serial.print(" Z: "); Serial.println(GyZNorm);

  delay(500); // Delay to reduce serial output frequency
}
