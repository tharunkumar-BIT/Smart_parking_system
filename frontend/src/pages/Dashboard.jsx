import Navbar from "./Navbar";

const Dashboard = ({logs, userData, slotData}) => {
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
          <p>
            Timestamp: {slotData.entry_timestamp || slotData.exit_timestamp}
          </p>
        </div>
      )}
      {logs.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">Parking Logs</h2>
          <ul>
            {logs.map((log, index) => (
              <li
                key={index}
                className="bg-white p-2 my-2 rounded-lg shadow-md"
              >
                <p>
                  <strong>Occupied:</strong> {log.occupied ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Entry:</strong> {log.entry_timestamp}
                </p>
                <p>
                  <strong>Exit:</strong> {log.exit_timestamp || "Still Parked"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
