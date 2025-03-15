import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import SlotStatus from "./pages/SlotStatus";

import { useEffect, useState } from "react";
import mqtt from "mqtt";
import Loader from "./Loader";

function App() {
  const [logs, setLogs] = useState([]);
  const [userData, setUserData] = useState(null);
  const [slotData, setSlotData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setTimeout(() => {
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/protected", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setIsAuthenticated(true);
          fetchLogs(data.id);
        } else {
          console.error("Error fetching user data:", await response.json());
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    const fetchLogs = async (userId) => {
      try {
        const response = await fetch(
          `http://localhost:3000/logs?user_id=${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setLogs(data);
        } else {
          console.error("Error fetching logs");
        }
      } catch (error) {
        console.error("Error fetching logs", error);
      }
    };

    fetchUserData();

    // Initialize MQTT connection
    const client = mqtt.connect("ws://localhost:9001");

    client.on("connect", () => {
      console.log("Connected to MQTT WebSocket");
      client.subscribe("logs/updates", (err) => {
        if (err) console.error("Subscription error:", err);
      });
    });

    client.on("message", (topic, message) => {
      if (topic === "logs/updates") {
        try {
          setSlotData(JSON.parse(message.toString()));
        } catch (error) {
          console.error("Error parsing MQTT message:", error);
        }
      }
    });

    return () => client.end(() => console.log("MQTT Client Disconnected"));
  }, 2000); 
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold animate-bounce"><Loader/></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {isAuthenticated ? (
          <>
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  logs={logs}
                  userData={userData}
                  slotData={slotData}
                />
              }
            />
            <Route path="/slotstatus" element={<SlotStatus logs={logs} />} />
          </>
        ) : (
          <Route path="*" element={<Login />} /> // Redirect unauthorized users to login
        )}
      </Routes>
    </Router>
  );
}

export default App;
