import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import Navbar from "./Navbar";
import Button from "../Button";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center justify-center text-center py-20"
      >
        <h1 className="text-4xl font-bold text-center text-black-600 mt-10">
          Find Your Parking Spot Easily
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          Seamless parking at your fingertips.
        </p>
        <p className="text-center text-gray-600 text-lg mt-4">
          Say goodbye to parking hassles! Our smart parking system helps you
          find and track parking slots in real time.
        </p>
        <Link to="/slotstatus" className="mt-6 px-6 py-3 transition-all">
          <Button />
        </Link>
      </motion.div>

      {/* How It Works Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="mt-12"
      >
        <h2 className="text-2xl font-semibold">How It Works</h2>
        <ul className="list-decimal pl-6 text-gray-700 mt-4 space-y-2">
          <li>Check available slots in real time.</li>
          <li>Get seamless entry and exit using smart detection.</li>
          <li>Monitor your parking history and optimize your trips.</li>
        </ul>
      </motion.div>

      {/* Why Choose Us Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="mt-12"
      >
        <h2 className="text-2xl font-semibold">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold text-blue-600">
              🚗 Real-Time Slot Availability
            </h3>
            <p className="text-gray-600 mt-2">
              Get instant updates on available parking slots to save time.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold text-blue-600">📊 Smart Analytics</h3>
            <p className="text-gray-600 mt-2">
              Track parking trends, peak times, and optimize your commute.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold text-blue-600">
              🔒 Secure & Hassle-Free
            </h3>
            <p className="text-gray-600 mt-2">
              Advanced security and seamless user experience.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="mt-12"
      >
        <h2 className="text-2xl font-semibold">What Our Users Say</h2>
        <div className="bg-gray-100 p-6 rounded-lg mt-6">
          <p className="text-gray-800 italic">
            "This smart parking system has changed the way I park my car. Finding
            a slot is so easy now!"
          </p>
          <p className="text-right font-bold text-blue-600 mt-2">
            — Alex M., Daily Commuter
          </p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg mt-4">
          <p className="text-gray-800 italic">
            "No more circling around for parking! The real-time availability
            feature is a game-changer."
          </p>
          <p className="text-right font-bold text-blue-600 mt-2">
            — Sarah L., Business Owner
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
