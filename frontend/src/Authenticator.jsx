import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


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

  return (
    <AuthContext.Provider
      value={{ userData, logs, slotStatus, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
