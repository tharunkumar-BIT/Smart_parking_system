#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <SPI.h>
#include <MFRC522.h>

// WiFi Credentials
const char* ssid = "TK's Pavilion";
const char* password = "tk####4502";

// MQTT Broker Details
const char* mqttServer = "192.168.137.1";
const int mqttPort = 1883;
const char* mqttTopic = "parking/data";

// RFID Module Pins
#define SS_PIN D4
#define RST_PIN D3
MFRC522 rfid(SS_PIN, RST_PIN);
MFRC522::MIFARE_Key key;

// Ultrasonic Sensor Pins
#define TRIG1 D0
#define ECHO1 D1
#define TRIG2 D2
#define ECHO2 D8

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
    Serial.begin(115200);
    SPI.begin();
    rfid.PCD_Init();

    for (byte i = 0; i < 6; i++) {
        key.keyByte[i] = 0xFF;
    }

    Serial.println("Connecting to WiFi...");
    WiFi.begin(ssid, password);

    // WiFi Timeout Mechanism
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 30) { // 30 attempts (~30 sec)
        delay(1000);
        Serial.print(".");
        attempts++;
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\nWiFi Connected!");
    } else {
        Serial.println("\nWiFi Connection Failed! Restarting...");
        ESP.restart(); // Restart ESP if WiFi fails
    }

    client.setServer(mqttServer, mqttPort);

    connectMQTT(); // Ensures MQTT connection

    pinMode(TRIG1, OUTPUT); pinMode(ECHO1, INPUT);
    pinMode(TRIG2, OUTPUT); pinMode(ECHO2, INPUT);
}

void loop() {
    if (!client.connected()) {
        connectMQTT(); // Reconnect if MQTT disconnects
    }
    client.loop();

    String rfidData = readRFID();
    int slot1 = checkParkingSlot(TRIG1, ECHO1);
    int slot2 = checkParkingSlot(TRIG2, ECHO2);

    Serial.print("Slot 1: "); Serial.println(slot1 ? "FILLED" : "EMPTY");
    Serial.print("Slot 2: "); Serial.println(slot2 ? "FILLED" : "EMPTY");

    if (rfidData != "") {
        sendDataToServer(rfidData, slot1, slot2);
    }

    Serial.println("---------------------------");
    delay(1000);
}

void connectMQTT() {
    while (!client.connected()) {
        Serial.println("Connecting to MQTT broker...");
        if (client.connect("ESP8266Client")) {
            Serial.println("Connected to MQTT broker!");
        } else {
            Serial.print("MQTT Connection Failed, State: ");
            Serial.println(client.state());
            delay(2000);
        }
    }
}

String readRFID() {
    for (int attempts = 0; attempts < 3; attempts++) { // Retry mechanism (3 attempts)
        if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
            Serial.println("Card detected!");

            byte block = 4;
            byte buffer[18];
            byte size = sizeof(buffer);

            MFRC522::StatusCode status = rfid.PCD_Authenticate(
                MFRC522::PICC_CMD_MF_AUTH_KEY_A, block, &key, &(rfid.uid));

            if (status != MFRC522::STATUS_OK) {
                Serial.print("Authentication failed: ");
                Serial.println(rfid.GetStatusCodeName(status));
                continue; // Retry
            }

            status = rfid.MIFARE_Read(block, buffer, &size);
            if (status != MFRC522::STATUS_OK) {
                Serial.print("Reading failed: ");
                Serial.println(rfid.GetStatusCodeName(status));
                continue; // Retry
            }

            String rfidData = "";
            for (byte i = 0; i < 16; i++) {
                rfidData += (char)buffer[i];
            }

            Serial.print("RFID Data: "); Serial.println(rfidData);

            rfid.PICC_HaltA();
            rfid.PCD_StopCrypto1();

            return rfidData;
        }
    }
    return "";
}

int checkParkingSlot(int trigPin, int echoPin) {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    long duration = pulseIn(echoPin, HIGH, 30000); // Timeout after 30ms
    if (duration == 0) {
        Serial.println("Ultrasonic sensor timeout!");
        return 0; // Assume slot is empty if no response
    }

    int distance = duration * 0.034 / 2;
    return (distance < 10);
}

void sendDataToServer(String rfidData, int slot1, int slot2) {
    if (client.connected()) {
        // Create a buffer to hold the JSON payload
        char payload[128]; // Adjust size based on your expected payload length

        // Format the JSON payload
        snprintf(payload, sizeof(payload), 
                 "{\"rfid\":\"%s\",\"slot1\":\"%s\",\"slot2\":\"%s\"}",
                 rfidData.c_str(), 
                 slot1 ? "FILLED" : "EMPTY", 
                 slot2 ? "FILLED" : "EMPTY");

        Serial.print("Publishing Payload: ");
        Serial.println(payload);

        // Publish the payload
        client.publish(mqttTopic, payload);
    } else {
        Serial.println("MQTT connection lost, reconnecting...");
        connectMQTT();
    }
}
