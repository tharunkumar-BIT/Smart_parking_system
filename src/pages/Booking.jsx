import { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, onSnapshot } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import mqtt from "mqtt";

const db = getFirestore(app);

const Booking = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Connect to MQTT broker
    const client = mqtt.connect("ws://your-mqtt-broker-ip:9001");
    client.on("connect", () => {
      console.log("Connected to MQTT");
      client.subscribe("parking/slots");
    });
    client.on("message", (topic, message) => {
      if (topic === "parking/slots") {
        const slots = JSON.parse(message.toString());
        setAvailableSlots(slots);
      }
    });
    return () => client.end();
  }, []);

  const handleBooking = async () => {
    try {
      await addDoc(collection(db, "bookings"), {
        slot: selectedSlot,
        date: new Date().toISOString(),
        userId: "RFID_user_id_placeholder",
      });
      alert("Booking Successful!");
      navigate("/dashboard");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2>Available Parking Slots</h2>
        <div>
          {availableSlots.map((slot) => (
            <button key={slot} onClick={() => setSelectedSlot(slot)}>{slot}</button>
          ))}
        </div>
        {selectedSlot && <button onClick={handleBooking}>Confirm Booking</button>}
      </div>
    </>
  );
};

export default Booking;