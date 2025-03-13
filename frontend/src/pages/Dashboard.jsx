import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import mqtt from "mqtt";
import Navbar from "./Navbar";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [slotData, setSlotData] = useState(null);
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
          const token = localStorage.getItem("token");
          if (!token) {
              navigate("/login");
              return;
          }
  
          const response = await fetch("http://localhost:3000/protected", {
              method: "GET",
              headers: {
                  "Authorization": `Bearer ${token}`
              }
          });
  
          if (response.ok) {
              const data = await response.json();
              setUserData(data);
          } else {
              console.error("Error fetching user data:", await response.json());
              localStorage.removeItem("token");
              navigate("/login");
          }
      } catch (error) {
          console.error("Error fetching user data:", error);
      }
  };
  

    const fetchLogs = async () => {
      try {
        const response = await fetch("http://localhost:3000/logs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setLogs(data);
        } else {
          console.error("Failed to fetch logs");
        }
      } catch (error) {
        console.error("Error fetching logs", error);
      }
    };

    fetchUserData();

    const client = mqtt.connect("ws://localhost:9001");
    client.on("connect", () => {
      client.subscribe("logs/updates");
    });
    client.on("message", (topic, message) => {
      if (topic === "logs/updates") {
        setSlotData(JSON.parse(message.toString()));
      }
    });
    return () => client.end();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar />
      {userData && (
        <div>
          <h2>{userData.email}</h2>
          <p>Role: {userData.isAdmin ? "Admin" : "User"}</p>
        </div>
      )}
      {slotData && (
        <div>
          <p>Email: {slotData.email}</p>
          <p>Occupied: {slotData.occupied ? "Yes" : "No"}</p>
          <p>Timestamp: {slotData.entry_timestamp || slotData.exit_timestamp}</p>
        </div>
      )}
      {logs.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">Parking Logs</h2>
          <ul>
            {logs.map((log, index) => (
              <li key={index} className="bg-white p-2 my-2 rounded-lg shadow-md">
                <p><strong>Email:</strong> {log.email}</p>
                <p><strong>Occupied:</strong> {log.occupied ? "Yes" : "No"}</p>
                <p><strong>Entry:</strong> {log.entry_timestamp}</p>
                <p><strong>Exit:</strong> {log.exit_timestamp || "Still Parked"}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
