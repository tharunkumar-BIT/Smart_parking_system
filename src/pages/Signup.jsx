import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const auth = getAuth(app);
const db = getFirestore(app);

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    district: "",
    state: "",
    pincode: "",
    aadhar: null,
    license: null,
    idProof: null,
    acknowledgment: false,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        "password123"
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), formData);
      alert("Signup Successful!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
    <div className="bg-gray-100 p-6">
      <Navbar/>
    </div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Sign Up
          </h2>
          <form onSubmit={handleSignup} className="mt-4 space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="border p-2 w-full"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border p-2 w-full"
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              className="border p-2 w-full"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="district"
              placeholder="District"
              className="border p-2 w-full"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              className="border p-2 w-full"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              className="border p-2 w-full"
              onChange={handleChange}
              required
            />

            <label className="block">Upload Documents:</label>
            <input
              type="file"
              name="aadhar"
              className="border p-2 w-full"
              onChange={handleChange}
              required
            />
            <input
              type="file"
              name="license"
              className="border p-2 w-full"
              onChange={handleChange}
              required
            />
            <input
              type="file"
              name="idProof"
              className="border p-2 w-full"
              onChange={handleChange}
              required
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                name="acknowledgment"
                className="mr-2"
                onChange={handleChange}
                required
              />
              <span className="text-sm">
                I acknowledge that all information provided is correct.
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
