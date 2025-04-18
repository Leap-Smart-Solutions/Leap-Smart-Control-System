#include <Wire.h>
#include <ESP8266WiFi.h>          // Correct library for ESP8266
#include <ESP8266WebServer.h>     // Web server for ESP8266
#include <WebSocketsServer.h>
#include <ArduinoJson.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

// Wi-Fi Credentials
const char* ssid = "Realme";
const char* password = "99999999";

// WebServer & WebSocket
ESP8266WebServer server(80);
WebSocketsServer webSocket(81);
Adafruit_MPU6050 mpu;

void sendData() {
    sensors_event_t a, g, temp;
    mpu.getEvent(&a, &g, &temp);

    StaticJsonDocument<200> jsonDoc;
    jsonDoc["accel_x"] = a.acceleration.x;
    jsonDoc["accel_y"] = a.acceleration.y;
    jsonDoc["accel_z"] = a.acceleration.z;
    jsonDoc["gyro_x"] = g.gyro.x;
    jsonDoc["gyro_y"] = g.gyro.y;
    jsonDoc["gyro_z"] = g.gyro.z;

    char buffer[200];
    serializeJson(jsonDoc, buffer);

    webSocket.broadcastTXT(buffer); // Send JSON data to all clients
}

// Web page served from ESP8266
const char webpage[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MPU6050 Data</title>
    <style>
        body { text-align: center; font-family: Arial, sans-serif; }
        h2 { margin-top: 20px; }
        p { font-size: 20px; font-weight: bold; }
    </style>
</head>
<body>
    <h2>MPU6050 Data</h2>
    <p id="sensorData">Waiting for data...</p>

    <script>
        var ws = new WebSocket("ws://" + window.location.hostname + ":81/");
        
        ws.onmessage = function(event) {
            let data = JSON.parse(event.data);
            document.getElementById("sensorData").innerHTML =
                `Accel: X=${data.accel_x.toFixed(2)} Y=${data.accel_y.toFixed(2)} Z=${data.accel_z.toFixed(2)} | ` +
                `Gyro: X=${data.gyro_x.toFixed(2)} Y=${data.gyro_y.toFixed(2)} Z=${data.gyro_z.toFixed(2)}`;
        };
    </script>
</body>
</html>
)rawliteral";

void handleRoot() {
    server.send(200, "text/html", webpage);
}

void setup() {
    Serial.begin(115200);
    Wire.begin(); // Initialize I2C for MPU6050

    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi...");
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi connected.");
    Serial.print("ESP IP Address: ");
    Serial.println(WiFi.localIP());

    server.on("/", handleRoot);
    server.begin();
    
    webSocket.begin();
    webSocket.onEvent([](uint8_t num, WStype_t type, uint8_t *payload, size_t length) {
        if (type == WStype_CONNECTED) {
            Serial.println("Client connected.");
        }
    });

    // Initialize MPU6050
    if (!mpu.begin()) {
        Serial.println("MPU6050 initialization failed!");
        while (1);
    }
    Serial.println("MPU6050 initialized successfully.");
}

void loop() {
    server.handleClient();
    webSocket.loop();

    if (webSocket.connectedClients() > 0) { // Only send data if a client is connected
        sendData();
    }

    delay(500); // Adjust delay for real-time updates
}
