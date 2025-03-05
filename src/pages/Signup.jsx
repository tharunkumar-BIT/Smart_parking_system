import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import axios from "axios";
import { app } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const auth = getAuth(app);
const db = getFirestore(app);

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    carNumber: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    carImage: null,
    aadhar: null,
    license: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Store essential data in Firebase
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        carNumber: formData.carNumber,
        email: formData.email,
        phone: formData.phone,
      });

      // Store full details in MySQL
      const response = await axios.post(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCKxGY2ssTc9FXsTU7mdY8r_qYSQ83ylnU",
        {
          email: formData.email,
          password: formData.password,
          returnSecureToken: true,
        }
      );
      console.log("Signup Success:", response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
    }
  };

  return (
    
        <div className="min-h-screen bg-gray-100 p-6">
        <Navbar />
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-6xl mt-8">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  required
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium">Car Registration Number</label>
                <input
                  type="text"
                  name="carNumber"
                  placeholder="Car Registration Number"
                  onChange={handleChange}
                  required
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  onChange={handleChange}
                  required
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium">State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  onChange={handleChange}
                  required
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium">Country</label>
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  onChange={handleChange}
                  required
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium">Pin Code</label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  onChange={handleChange}
                  required
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  onChange={handleChange}
                  required
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                  required
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                required
                className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="border-t border-gray-300 pt-4">
              <h3 className="text-lg font-semibold text-gray-700">Upload Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium">Car Image</label>
                  <input type="file" name="carImage" onChange={handleChange} required className="border p-2 rounded-lg"/>
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium">Aadhar Card</label>
                  <input type="file" name="aadhar" onChange={handleChange} required className="border p-2 rounded-lg"/>
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium">License</label>
                  <input type="file" name="license" onChange={handleChange} required className="border p-2 rounded-lg"/>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300">
              Sign Up
            </button>
          </form>
        </div>
      </div>

  );
};

export default Signup;
