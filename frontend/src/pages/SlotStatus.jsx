import Navbar from "./Navbar";
const SlotStatus = ({ logs }) => {
  const TOTAL_SLOTS = 4; // Total number of parking slots
  const occupiedSlots = logs.filter((log) => log.occupied).length; // Count occupied slots
  const unoccupiedSlots = TOTAL_SLOTS - occupiedSlots; // Calculate unoccupied slots

  return (
    <div className="min-h-screen bg-gray-100 p-6">
        <Navbar />
      <h2 className="text-2xl font-bold">Slot Status</h2>
      <p className="text-lg">Total Slots: {TOTAL_SLOTS}</p>
      <p className="text-lg">Unoccupied Slots: {unoccupiedSlots}</p>
    </div>
  );
};

export default SlotStatus;
