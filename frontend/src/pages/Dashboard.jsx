import Navbar from "./Navbar";
import { useState } from "react";

const Dashboard = ({ logs, userData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 5;

  // Pagination Logic
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const totalUserBookings = logs.filter(log => log.user_id === userData.id);
  const userLogs = logs.filter(log => log.user_id === userData.id || log.car_number === userData.car_number).slice(-5);;
  const currentLogs = userLogs;

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A";
    const dateObj = new Date(timestamp);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    const formattedTime = dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${formattedDate}, ${formattedTime}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar />

      {/* ✅ Welcome Section */}
      {userData && (
        <div className="p-6 text-center animate-fade-in">
          <h1 className="text-4xl font-extrabold text-blue-600 drop-shadow-md">
            Welcome Back, {userData.name}! 🚗
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Here’s an overview of your parking activity and slot status.
          </p>
        </div>
      )}

      {/* ✅ User Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <h3 className="text-xl font-bold text-blue-600">Total Bookings</h3>
          <p className="text-gray-700 text-lg mt-2 font-semibold">
            {totalUserBookings.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <h3 className="text-xl font-bold text-blue-600">Your car number</h3>
          <p className="text-gray-700 text-lg mt-2 font-semibold">
            {userData.car_number}
          </p>
        </div>
      </div>

      {/* ✅ Live Parking Logs Table with Pagination */}
      {logs.length > 0 && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md animate-slide-up">
          <h2 className="text-xl font-bold">Your Recent Parking Logs</h2>
          <table className="w-full mt-4">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3">Slot</th>
                <th className="p-3">Occupied</th>
                <th className="p-3">Entry Time</th>
                <th className="p-3">Exit Time</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.map((log, index) => (
                <tr key={index} className="text-center border-b hover:bg-gray-100 transition">
                  <td className="p-3">{indexOfFirstLog + index + 1}</td>
                  <td className="p-3">
                    {log.occupied ? (
                      <span className="text-red-500 font-semibold">Yes</span>
                    ) : (
                      <span className="text-green-500 font-semibold">No</span>
                    )}
                  </td>
                  <td className="p-3">{formatDateTime(log.entry_timestamp)}</td>
                  <td className="p-3">
                    {log.exit_timestamp ? formatDateTime(log.exit_timestamp) : "Still Parked"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
