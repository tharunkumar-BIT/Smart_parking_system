import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";


const Navbar = ()=>{

    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Parking Slot Booking</h1>
        <div className="flex items-center">
          <Link to="/login" className="mr-4 text-blue-500 hover:underline">Login</Link>
          <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
          <div className="relative ml-4">
            <FaUserCircle className="text-3xl cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)} />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
                <Link to="/about" className="block px-4 py-2 hover:bg-gray-100">About Us</Link>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </nav>
    );
}

export default Navbar;