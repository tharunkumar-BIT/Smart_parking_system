#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <SPI.h>
#include <MFRC522.h>

const char* ssid = "TK's Pavilion";
const char* password = "tk####4502";

const char* mqttServer = "192.168.137.1";
const int mqttPort = 1883;
const char* mqttTopic = "parking/data";       // Topic for RFID data (email)
const char* slotStatusTopic = "slotStatus/update"; // Topic for slot status updates

#define SS_PIN D4
#define RST_PIN D3
MFRC522 rfid(SS_PIN, RST_PIN);
MFRC522::MIFARE_Key key;

#define TRIG1 D0
#define ECHO1 D1
#define TRIG2 D2
#define ECHO2 D8

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastSlotStatusUpdate = 0;       // Track the last time slot status was sent
const unsigned long slotStatusInterval = 1000; // Send slot status every 1 second

void setup() {
    Serial.begin(115200);
    SPI.begin();
    rfid.PCD_Init();

    for (byte i = 0; i < 6; i++) {
        key.keyByte[i] = 0xFF;
    }

    Serial.println("Connecting to WiFi...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("\nWiFi Connected!");

    client.setServer(mqttServer, mqttPort);
    connectMQTT();

    pinMode(TRIG1, OUTPUT); pinMode(ECHO1, INPUT);
    pinMode(TRIG2, OUTPUT); pinMode(ECHO2, INPUT);
}

void loop() {
    if (!client.connected()) {
        connectMQTT();
    }
    client.loop();

    // Check and send slot status periodically
    if (millis() - lastSlotStatusUpdate >= slotStatusInterval) {
        int slot1 = checkParkingSlot(TRIG1, ECHO1);
        int slot2 = checkParkingSlot(TRIG2, ECHO2);
        sendSlotStatus(slot1, slot2); // Send slot status to MQTT broker
        lastSlotStatusUpdate = millis(); // Update the last send time
    }

    // Handle RFID scanning
    String email = readRFID();
    if (email != "") {
        sendEmailData(email); // Send only the email to the MQTT broker
    }

    delay(100); // Small delay to avoid overloading the loop
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
    if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
        Serial.println("Card detected!");

        byte block = 4;
        byte buffer[18];  // Increased buffer size to avoid issues
        byte size = sizeof(buffer);

        MFRC522::StatusCode status = rfid.PCD_Authenticate(
            MFRC522::PICC_CMD_MF_AUTH_KEY_A, block, &key, &(rfid.uid));

        if (status != MFRC522::STATUS_OK) {
            Serial.print("Authentication failed: ");
            Serial.println(rfid.GetStatusCodeName(status));
            return "";
        }

        status = rfid.MIFARE_Read(block, buffer, &size);
        if (status != MFRC522::STATUS_OK) {
            Serial.print("Reading failed: ");
            Serial.println(rfid.GetStatusCodeName(status));
            return "";
        }

        String email = "";
        for (byte i = 0; i < 16; i++) {
            if (buffer[i] == 0x00 || buffer[i] == 0xFF) break; // Stop at null or empty bytes
            email += (char)buffer[i];
        }

        email.trim();  // Removes leading/trailing spaces

        Serial.print("Email Read: "); Serial.println(email);

        rfid.PICC_HaltA();
        rfid.PCD_StopCrypto1();

        return email;
    }
    return "";
}

int checkParkingSlot(int trigPin, int echoPin) {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    long duration = pulseIn(echoPin, HIGH, 30000);
    if (duration == 0) {
        Serial.println("Ultrasonic sensor timeout!");
        return 0;
    }

    int distance = duration * 0.034 / 2;
    return (distance < 10); // Return 1 if occupied, 0 if available
}

// Send only the email data (RFID scan)
void sendEmailData(String email) {
    String fullEmail = email + "@gmail.com";
    if (client.connected()) {
        char payload[64];

        snprintf(payload, sizeof(payload),
                "{\"email\":\"%s\"}",
                fullEmail.c_str());

        Serial.print("Publishing Email Payload: ");
        Serial.println(payload);

        client.publish(mqttTopic, payload);
    } else {
        Serial.println("MQTT connection lost, reconnecting...");
        connectMQTT();
    }
}

// Send only the slot status data
void sendSlotStatus(int slot1, int slot2) {
    if (client.connected()) {
        char payload[64];

        snprintf(payload, sizeof(payload),
                "{\"slot1\":\"%d\",\"slot2\":\"%d\"}",
                slot1,
                slot2);

        Serial.print("Publishing Slot Status: ");
        Serial.println(payload);

        client.publish(slotStatusTopic, payload);
    } else {
        Serial.println("MQTT connection lost, reconnecting...");
        connectMQTT();
    }
}