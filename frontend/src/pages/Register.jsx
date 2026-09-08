// pages/Register.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "buyer",
    providerType: "", // For food providers, this will be either "restaurant" or "home-cook"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    // ✅ NAYA — sirf tab providerType bhejo jab role "provider" ho,
    // warna backend ko empty string ki jagah field milega hi nahi (undefined)
    const payload = { ...formData };
    if (payload.role !== "provider") {
      delete payload.providerType;
    }

    const response = await api.post("/auth/register", payload);
    login(response.data.user, response.data.token);
    navigate("/dashboard");
  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong. Try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Your Account</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
          >
            <option value="buyer">Buyer / Receiver</option>
            <option value="provider">Food Provider</option>
            <option value="delivery">Delivery Partner</option>
          </select>

        </div>
       {formData.role === "provider" && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Provider Type
    </label>
    <select
      name="providerType"
      value={formData.providerType}
      onChange={handleChange}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
    >
      <option value="">Select provider type</option>
      <option value="restaurant">Restaurant</option>
      <option value="cafe">Café</option>
      <option value="hotel">Hotel</option>
      <option value="caterer">Caterer</option>
      <option value="event_organizer">Wedding / Event Organizer</option>
      <option value="bhandara_organizer">Bhandara Organizer</option>
      <option value="hostel_mess">Hostel / Mess</option>
      <option value="canteen">Canteen</option>
      <option value="other">Other</option>
    </select>
  </div>
)}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-remeal-green text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-remeal-green font-medium hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;