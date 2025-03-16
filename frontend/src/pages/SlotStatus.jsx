import Navbar from "./Navbar";
import { useState } from "react";

const SlotStatus = ({ logs }) => {
  const TOTAL_SLOTS = 4; // Total number of parking slots
  const [currentLogs, setCurrentLogs] = useState(logs);
  const occupiedSlots = currentLogs.filter((log) => log.occupied).length;
  const unoccupiedSlots = TOTAL_SLOTS - occupiedSlots;

  const handleRefresh = () => {
    // Simulate fetching real-time data
    setCurrentLogs([...logs]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 animate-fade-in">
      <Navbar />
      <div className="p-6 rounded-lg text-center animate-slide-up">
        <h2 className="text-3xl font-bold text-blue-600 drop-shadow-md">Parking Slot Status</h2>
        <p className="text-gray-600 mt-2 text-lg">Monitor real-time availability of parking slots.</p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <h3 className="text-xl font-bold text-blue-600">Total Slots</h3>
          <p className="text-gray-700 text-lg mt-2 font-semibold">{TOTAL_SLOTS}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <h3 className="text-xl font-bold text-green-600">Available Slots</h3>
          <p className="text-gray-700 text-lg mt-2 font-semibold">{unoccupiedSlots}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <h3 className="text-xl font-bold text-red-600">Occupied Slots</h3>
          <p className="text-gray-700 text-lg mt-2 font-semibold">{occupiedSlots}</p>
        </div>
      </div>
    </div>
  );
};

export default SlotStatus;
