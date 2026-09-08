// pages/Login.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");     // error message dikhane ke liye
  const [loading, setLoading] = useState(false); // button pe "Logging in..." dikhane ke liye

  const { login } = useAuth();      // AuthContext ka login function
  const navigate = useNavigate();   // successful login ke baad redirect karne ke liye

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Actual backend call
      const response = await api.post("/auth/login", formData);

      // response.data = { success, message, user, token }
      login(response.data.user, response.data.token); // AuthContext me save karo

      navigate("/dashboard"); // login successful → dashboard pe bhej do
    } catch (err) {
      // Backend se aaya error message dikhao (jaise "Invalid email or password")
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Login to ReMeal</h1>

      {/* Error message — sirf tab dikhega jab error state me kuch ho */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
            placeholder="you@example.com"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-remeal-green text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-remeal-green font-medium hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;