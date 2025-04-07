#include "ESP8266WiFi.h"
#include <Firebase_ESP_Client.h>

#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

#define LED_PIN 0        // GPIO0 for LED
#define BUTTON_PIN 2     // GPIO2 for Button

#define WIFI_SSID "Realme"
#define WIFI_PASSWORD "99999999"

#define API_KEY "AIzaSyB3yQU7cFo3T_-NZdD0-YuuxrcDfkwhkqk"
#define DATABASE_URL "https://leap-smart-band-default-rtdb.firebaseio.com/"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

bool ledState = false;
bool lastButtonReading = HIGH;
bool currentButtonState = HIGH;
unsigned long lastDebounceTime = 0;
const unsigned long debounceDelay = 50;
unsigned long sendDataPrevMillis = 0;
bool signupOK = false;

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);  // GPIO0 needs pull-up

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("Firebase signup OK");
    signupOK = true;
  } else {
    Serial.printf("Firebase signup failed: %s\n", config.signer.signupError.message.c_str());
  }

  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  bool reading = digitalRead(BUTTON_PIN);

  if (reading != lastButtonReading) {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (currentButtonState == HIGH && reading == LOW) {
      ledState = !ledState;
      digitalWrite(LED_PIN, ledState ? HIGH : LOW);
      Serial.print("Button Pressed - LED: ");
      Serial.println(ledState ? "ON" : "OFF");

      if (Firebase.ready() && signupOK) {
        String valueToSend = ledState ? "1" : "0";
        if (Firebase.RTDB.setString(&fbdo, "/Lights/stat", valueToSend)) {
          Serial.println("Firebase updated.");
        } else {
          Serial.print("Firebase setString failed: ");
          Serial.println(fbdo.errorReason());
        }
      }
    }
    currentButtonState = reading;
  }

  lastButtonReading = reading;

  // Firebase polling
  if (millis() - sendDataPrevMillis > 3000 || sendDataPrevMillis == 0) {
    sendDataPrevMillis = millis();

    if (Firebase.ready() && signupOK) {
      if (Firebase.RTDB.getString(&fbdo, "/Lights/stat")) {
        String cloudValue = fbdo.stringData();
        bool newLedState = (cloudValue == "1");
        if (newLedState != ledState) {
          ledState = newLedState;
          digitalWrite(LED_PIN, ledState ? HIGH : LOW);
          Serial.print("Updated from Firebase - LED: ");
          Serial.println(ledState ? "ON" : "OFF");
        }
      } else {
        Serial.print("Firebase getString failed: ");
        Serial.println(fbdo.errorReason());
      }
    }
  }
}
