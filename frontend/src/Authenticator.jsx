import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import mqtt from "mqtt";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [slotStatus, setSlotStatus] = useState([]); // Ensure it's an array
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    setLoading(true); // Start loading
    const timeout = setTimeout(() => {
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);

        // Fix: use window.location.pathname instead of undefined variable
        if (window.location.pathname !== "/signup") {
          navigate("/login");
        }
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
            navigate("/login");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsAuthenticated(false);
          navigate("/login");
        } finally {
          setLoading(false); // Stop loading after fetch
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
    }, 1700); // 1.7-second delay for loading effect

    return () => clearTimeout(timeout); // Cleanup timeout on unmount
  }, [navigate]);

  useEffect(() => {
    const client = mqtt.connect("ws://localhost:9001");

    client.on("connect", () => {
        console.log("Connected to MQTT WebSocket");
        client.subscribe("slotStatus/update", (err) => {
            if (err) {
                console.error("Error subscribing to topic:", err);
            } else {
                console.log("Subscribed to topic: slotStatus/update");
            }
        });
    });

    client.on("message", (topic, message) => {
        console.log(`Received MQTT message on topic ${topic}:`, message.toString());
        if (topic === "slotStatus/update") {
            try {
                const data = JSON.parse(message.toString());
                const { occupiedSlots } = data;
                console.log("Updating slotStatus:", occupiedSlots);
                setSlotStatus(occupiedSlots || []); // Default to an empty array if occupiedSlots is undefined
            } catch (error) {
                console.error("Error parsing MQTT message:", error);
            }
        }
    });

    client.on("error", (err) => {
        console.error("MQTT error:", err);
    });

    client.on("close", () => {
        console.log("MQTT connection closed");
    });

    return () => {
        if (client) {
            client.end();
        }
    };
}, []);

  return (
    <AuthContext.Provider
      value={{ userData, logs, slotStatus, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
