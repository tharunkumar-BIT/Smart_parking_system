const mqtt = require("mqtt");
const db = require("../db");
const admin = require("../firebaseConfig");

const mqttClient = mqtt.connect("mqtt://your-mqtt-broker-ip");

mqttClient.on("connect", () => {
  console.log("Connected to MQTT Broker");

  // Subscribe to parking slot availability
  mqttClient.subscribe("parking/slots");

  // Subscribe to RFID scans
  mqttClient.subscribe("rfid/scanned");
});

mqttClient.on("message", async (topic, message) => {
  if (topic === "parking/slots") {
    const slots = JSON.parse(message.toString());
    slots.forEach((slot) => {
      db.query("UPDATE parking_slots SET available = ? WHERE id = ?", [slot.available, slot.id]);
    });
  } else if (topic === "rfid/scanned") {
    const rfid = message.toString();
    
    // Fetch user by RFID
    db.query("SELECT * FROM users WHERE rfid = ?", [rfid], async (err, results) => {
      if (err || results.length === 0) return;

      const user = results[0];

      // Publish user details back to MQTT
      mqttClient.publish("rfid/user_data", JSON.stringify({
        name: user.name,
        carNumber: user.carNumber,
        time: new Date().toISOString(),
      }));

      // Store in Firebase
      await admin.firestore().collection("users").doc(user.email).update({ lastScanned: new Date() });
    });
  }
});

module.exports = mqttClient;
