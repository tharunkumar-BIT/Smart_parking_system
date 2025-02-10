import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
// import QRCode from "qrcode.react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

const auth = getAuth(app);
const db = getFirestore(app);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [booking, setBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
        const bookingRef = doc(db, "bookings", currentUser.uid);
        const bookingSnap = await getDoc(bookingRef);
        if (bookingSnap.exists()) {
          setBooking(bookingSnap.data());
        }
      }
    });
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto mt-16"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Dashboard
        </h2>
        {user && (
          <div className="mt-6">
            <p className="text-lg font-semibold">Username: {user.email}</p>
            <p className="text-lg">
              Vehicle Number: {booking?.vehicleNumber || "Not Provided"}
            </p>
            <p className="text-lg">
              Location: {booking?.location || "Unknown"}
            </p>
            {booking?.slotNumber ? (
              <div className="mt-4 p-4 bg-green-100 rounded-lg">
                <p className="text-lg font-semibold text-green-600">
                  Slot Booked
                </p>
                <p>Slot Number: {booking.slotNumber}</p>
                <p>Date: {booking.date}</p>
                <p>Time: {booking.time}</p>
              </div>
            ) : (
              <p className="mt-4 text-lg text-red-500">No Slot Booked</p>
            )}
            {booking?.paymentCompleted && (
              <div className="mt-6 text-center">
                <p className="text-lg font-semibold text-blue-600">
                  Payment Completed
                </p>
                <QRCode value={booking.vehicleNumber} className="mt-4" />
              </div>
            )}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg mt-6 w-full"
        >
          Logout
        </button>
      </motion.div>
    </div>
  );
};

export default Dashboard;
