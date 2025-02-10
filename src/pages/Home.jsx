import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Parking Slot Booking</h1>
        <div>
          <Link to="/login" className="mr-4 text-blue-500 hover:underline">Login</Link>
          <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center justify-center text-center py-20"
      >
        <h2 className="text-4xl font-bold text-gray-800">Find & Book Your Parking Spot Easily</h2>
        <p className="text-gray-600 mt-4 text-lg">Seamless parking reservations at your fingertips.</p>
        <Link to="/dashboard" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
          Get Started
        </Link>
      </motion.div>
    </div>
  );
};

export default Home;
