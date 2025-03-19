import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="flex justify-between p-4 bg-white shadow-md">
      <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-3">
        <img
          src="/main-logo-transparent.png"
          alt="Parking Icon"
          className="w-8 h-8"
        />
        Smart Parking System
      </Link>
      <div className="relative">
        {user ? (
          <div className="relative">
            <FaUserCircle
              className="text-3xl cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg border border-gray-200 z-50">
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                >
                  Dashboard
                </Link>
                <Link
                  to="/"
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-700 flex items-center"
                >
                  Home
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <Link to="/login" className="text-blue-600 mr-4">
              Login
            </Link>
            <Link to="/signup" className="text-blue-600">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
