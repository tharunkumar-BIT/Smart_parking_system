import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";
import mqtt from "mqtt";
import Navbar from "./Navbar";

const db = getFirestore(app);

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [slotData, setSlotData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(db, "users", "RFID_user_id_placeholder");
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
    };
    fetchUserData();

    const client = mqtt.connect("ws://your-mqtt-broker-ip:9001");
    client.on("connect", () => {
      client.subscribe("rfid/scanned");
    });
    client.on("message", (topic, message) => {
      if (topic === "rfid/scanned") {
        setSlotData(JSON.parse(message.toString()));
      }
    });
    return () => client.end();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar/>
      {userData && (
        <div>
          <h2>{userData.name}</h2>
          <p>Vehicle: {userData.carNumber}</p>
        </div>
      )}
      {slotData && (
        <div>
          <p>Slot: {slotData.slot}</p>
          <p>Time: {slotData.time}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;