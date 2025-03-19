import Navbar from "./Navbar";

const SlotStatus = ({ logs }) => {
  const TOTAL_SLOTS = 4; // Total parking slots

  // Count occupied slots
  const occupiedSlots = logs.filter((log) => log.occupied).length;
  const unoccupiedSlots = TOTAL_SLOTS - occupiedSlots;

  // Generate the slot boxes
  const slots = [
    ...Array(occupiedSlots).fill({ occupied: true }), // Red occupied slots
    ...Array(unoccupiedSlots).fill({ occupied: false }), // Green available slots
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 animate-fade-in">
      <Navbar />
      <div className="p-6 rounded-lg text-center animate-slide-up">
        <h2 className="text-3xl font-bold text-blue-600 drop-shadow-md">
          Parking Slot Status
        </h2>
        <p className="text-gray-600 mt-2 text-lg">
          Monitor real-time availability of parking slots.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <h3 className="text-xl font-bold text-blue-600">Total Slots</h3>
          <p className="text-gray-700 text-lg mt-2 font-semibold">
            {TOTAL_SLOTS}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <h3 className="text-xl font-bold text-green-600">Available Slots</h3>
          <p className="text-gray-700 text-lg mt-2 font-semibold">
            {unoccupiedSlots}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <h3 className="text-xl font-bold text-red-600">Occupied Slots</h3>
          <p className="text-gray-700 text-lg mt-2 font-semibold">
            {occupiedSlots}
          </p>
        </div>
      </div>

      {/* Display slots with the correct number of red and green boxes */}
      <div className="grid grid-cols-2 gap-6 mt-6 max-w-md mx-auto">
        {slots.map((slot, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg text-white text-center font-bold text-xl shadow-lg transition-transform transform hover:scale-105 ${
              slot.occupied ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {slot.occupied ? "🚗 Occupied" : "🅿️ Available"}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlotStatus;
