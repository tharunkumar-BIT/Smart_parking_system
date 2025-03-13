#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN D4  
#define RST_PIN D3 

MFRC522 rfid(SS_PIN, RST_PIN);
MFRC522::MIFARE_Key key;

void setup() {
    Serial.begin(115200);
    SPI.begin();
    rfid.PCD_Init();

    // Default key for RFID cards
    for (byte i = 0; i < 6; i++) {
        key.keyByte[i] = 0xFF;
    }

    Serial.println("Scan your RFID card to WRITE data...");
}

void loop() {
    // Wait for an RFID card
    if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
        return;
    }

    Serial.println("Card detected!");

    byte block = 4;  // We will write to Block 4
    byte dataToWrite[16] = "7376221EC106";  // 16 bytes of data (spaces added to fill)

    Serial.print("Writing to Block "); Serial.println(block);

    // Authenticate with the card
    MFRC522::StatusCode status = rfid.PCD_Authenticate(
        MFRC522::PICC_CMD_MF_AUTH_KEY_A, block, &key, &(rfid.uid));

    if (status != MFRC522::STATUS_OK) {
        Serial.print("Authentication failed: ");
        Serial.println(rfid.GetStatusCodeName(status));
        return;
    }

    // Write data to the card
    status = rfid.MIFARE_Write(block, dataToWrite, 16);
    
    if (status != MFRC522::STATUS_OK) {
        Serial.print("Writing failed: ");
        Serial.println(rfid.GetStatusCodeName(status));
    } else {
        Serial.println("Data successfully written!");
    }

    // Halt the card
    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
}
