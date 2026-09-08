// pages/CreateFoodRequest.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createFoodRequest } from "../services/foodRequestService";

const CreateFoodRequest = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    foodType: "any",
    requiredQuantity: "",
    requiredDate: "",
    requiredTime: "",
    address: "",
    latitude: "",
    longitude: "",
    budget: "",
    purpose: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        requiredQuantity: Number(formData.requiredQuantity),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        budget: Number(formData.budget) || 0,
      };

      await createFoodRequest(payload);
      navigate("/my-requests");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Food Request</h1>
      <p className="text-gray-600 text-sm mb-6">
        Need food for an event, shelter, or community meal? Let nearby providers know.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Required Quantity (meals)
            </label>
            <input
              type="number"
              name="requiredQuantity"
              value={formData.requiredQuantity}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
            <select
              name="foodType"
              value={formData.foodType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
            >
              <option value="any">Any</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="non_vegetarian">Non-Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Required Date</label>
            <input
              type="date"
              name="requiredDate"
              value={formData.requiredDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Required Time</label>
            <input
              type="text"
              name="requiredTime"
              value={formData.requiredTime}
              onChange={handleChange}
              required
              placeholder="e.g. 8:00 PM"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="e.g. Mansarovar, Jaipur"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Budget (₹, optional — 0 for donation request)
          </label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
          <textarea
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            rows={2}
            placeholder="e.g. Community meal for shelter"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-remeal-green text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
};

export default CreateFoodRequest;