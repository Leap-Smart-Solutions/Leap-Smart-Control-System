 #include <Wire.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

// Wi-Fi credentials
const char* ssid = "Realme";
const char* password = "99999999";

// MPU6050 and server instances
Adafruit_MPU6050 mpu;
ESP8266WebServer server(80);
WebSocketsServer webSocket = WebSocketsServer(81);

// Send sensor data as JSON over WebSocket
void sendData() {
    sensors_event_t acc, gyro, temp;
    mpu.getEvent(&acc, &gyro, &temp);

    StaticJsonDocument<200> jsonDoc;
    jsonDoc["accel_x"] = acc.acceleration.x;
    jsonDoc["accel_y"] = acc.acceleration.y;
    jsonDoc["accel_z"] = acc.acceleration.z;
    jsonDoc["gyro_x"] = gyro.gyro.x;
    jsonDoc["gyro_y"] = gyro.gyro.y;
    jsonDoc["gyro_z"] = gyro.gyro.z;

    char buffer[200];
    serializeJson(jsonDoc, buffer);
    webSocket.broadcastTXT(buffer);
}

// HTML webpage served to clients
const char webpage[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>MPU6050 Live Data</title>
    <style>
        body { font-family: Arial; text-align: center; padding-top: 30px; }
        h2 { margin-bottom: 20px; }
        table { margin: auto; border-collapse: collapse; width: 90%; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
        th { background-color: #f2f2f2; }
        #downloadBtn { margin-top: 20px; padding: 10px 20px; font-size: 16px; }
    </style>
</head>
<body>
    <h2>MPU6050 Sensor Data</h2>
    <button id="downloadBtn">Download CSV</button>
    <table id="dataTable">
        <thead>
            <tr>
                <th>Timestamp</th>
                <th>Accel X</th><th>Accel Y</th><th>Accel Z</th>
                <th>Gyro X</th><th>Gyro Y</th><th>Gyro Z</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>

    <script>
        const ws = new WebSocket("ws://" + location.hostname + ":81/");
        const dataTableBody = document.querySelector("#dataTable tbody");
        const dataArray = [];

        ws.onmessage = function(event) {
            const data = JSON.parse(event.data);
            const time = new Date().toLocaleTimeString();

            // Store data in memory
            const row = {
                timestamp: time,
                ax: data.accel_x.toFixed(2),
                ay: data.accel_y.toFixed(2),
                az: data.accel_z.toFixed(2),
                gx: data.gyro_x.toFixed(2),
                gy: data.gyro_y.toFixed(2),
                gz: data.gyro_z.toFixed(2)
            };
            dataArray.push(row);

            // Add row to table
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${row.timestamp}</td>
                            <td>${row.ax}</td><td>${row.ay}</td><td>${row.az}</td>
                            <td>${row.gx}</td><td>${row.gy}</td><td>${row.gz}</td>`;
            dataTableBody.appendChild(tr);
        };

        document.getElementById("downloadBtn").addEventListener("click", function () {
            let csv = "Timestamp,Accel X,Accel Y,Accel Z,Gyro X,Gyro Y,Gyro Z\n";
            dataArray.forEach(row => {
                csv += `${row.timestamp},${row.ax},${row.ay},${row.az},${row.gx},${row.gy},${row.gz}\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "sensor_data.csv";
            a.click();
            window.URL.revokeObjectURL(url);
        });
    </script>
</body>
</html>
)rawliteral";

// Serve the webpage
void handleRoot() {
    server.send(200, "text/html", webpage);
}

void setup() {
    Serial.begin(115200);
    Wire.begin(0, 2);  // SDA = GPIO0, SCL = GPIO2 for ESP-01S

    // Connect to Wi-Fi
    Serial.println("Connecting to Wi-Fi...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(100);
    }
    Serial.println("\nConnected.");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());

    // Initialize MPU6050
    if (!mpu.begin()) {
        Serial.println("MPU6050 not found!");
        while (true);
    }
    Serial.println("MPU6050 initialized.");

    // Set optional sensor configs
    mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
    mpu.setGyroRange(MPU6050_RANGE_500_DEG);
    mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

    // Start server and WebSocket
    server.on("/", handleRoot);
    server.begin();

    webSocket.begin();
    webSocket.onEvent([](uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
        if (type == WStype_CONNECTED) {
            Serial.printf("Client connected: %u\n", num);
        }
    });
}

void loop() {
    server.handleClient();
    webSocket.loop();

    if (webSocket.connectedClients() > 0) {
        sendData();
    }

    delay(100); // Adjust rate of updates
}
