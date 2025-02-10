import { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { button } from "framer-motion/client";

const db = getFirestore(app);

const slots = Array.from({ length: 10 }, (_, i) => `Slot ${i + 1}`); // Example slot numbers

const Booking = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [paymentApproved, setPaymentApproved] = useState(false);
  const navigate = useNavigate();

  const handleSlotSelection = (slot) => {
    setSelectedSlot(slot);
  };

  const handlePayment = async () => {
    setPaymentApproved(true); // Temporary approval simulation
    try {
      await addDoc(collection(db, "bookings"), {
        slot: selectedSlot,
        date: new Date().toISOString(),
        paymentCompleted: true,
      });
      alert("Booking Successful!");
      navigate("/dashboard");
    } catch (error) {
      alert("Error processing booking: " + error.message);
    }
  };

  return (
    <>
      <div className="bg-gray-100 p-6">
        <Navbar />
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Select a Parking Slot
          </h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {slots.map((slot) => (
              <button
                key={slot}
                className={`p-3 border rounded-lg ${
                  selectedSlot === slot
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => handleSlotSelection(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
          {selectedSlot && (
            <div className="mt-6">
              <p className="text-lg font-semibold">
                Selected Slot: {selectedSlot}
              </p>
              <button
                onClick={handlePayment}
                className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all"
              >
                Proceed to Payment
              </button>
            </div>
          )}
          {paymentApproved && (
            <>
              
              <button
                className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all"
                onClick={() => navigate("/")}
              >
                Go to Home
              </button>
              <p className="mt-4 text-green-600 font-bold">Payment Approved!</p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Booking;
