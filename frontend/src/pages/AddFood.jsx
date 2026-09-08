// pages/AddFood.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createFood } from "../services/foodService";

const AddFood = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    foodType: "vegetarian",
    listingType: "SURPLUS",
    quantity: "",
    servings: "",
    originalPrice: "",
    price: "",
    availableFrom: "",
    availableUntil: "",
    consumeBefore: "",
    storageType: "",
    safetyDeclaration: false,
    pickupAddress: "",
    latitude: "",
    longitude: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Text/number/select fields ke liye
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Checkbox alag se handle karna padta hai — uski value "checked" property me hoti hai
  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, safetyDeclaration: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend-side quick validation — safety declaration check honi chahiye
    if (!formData.safetyDeclaration) {
      setError("Please confirm the food safety declaration before publishing.");
      return;
    }

    setLoading(true);
    try {
      // Backend ko numbers chahiye, HTML input se hamesha string aati hai —
      // isliye yaha explicitly Number() se convert kar rahe hain
      const payload = {
        ...formData,
        quantity: Number(formData.quantity),
        servings: Number(formData.servings),
        originalPrice: Number(formData.originalPrice) || 0,
        price: Number(formData.price),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      };

      await createFood(payload);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">List Surplus Food</h1>
      <p className="text-gray-600 text-sm mb-6">
        Fill in the details of the safe, unserved surplus food you want to list.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ---- Basic Info ---- */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Food Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Paneer Rice"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. Freshly cooked, unserved surplus from today's catering event"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
              <select
                name="foodType"
                value={formData.foodType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="non_vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
              <select
                name="listingType"
                value={formData.listingType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
              >
                <option value="SURPLUS">Surplus (event-based)</option>
                <option value="END_OF_DAY_SURPLUS">End of Day Surplus</option>
              </select>
            </div>
          </div>
        </div>

        {/* ---- Quantity & Price ---- */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Quantity & Price</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Servings</label>
              <input
                type="number"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Regular Price (₹)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ReMeal Price (₹) — 0 for free
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
              />
            </div>
          </div>
        </div>

        {/* ---- Availability ---- */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Availability</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
            <input
              type="datetime-local"
              name="availableFrom"
              value={formData.availableFrom}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available Until</label>
            <input
              type="datetime-local"
              name="availableUntil"
              value={formData.availableUntil}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Consume Before</label>
            <input
              type="datetime-local"
              name="consumeBefore"
              value={formData.consumeBefore}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Storage Method (optional)
            </label>
            <input
              type="text"
              name="storageType"
              value={formData.storageType}
              onChange={handleChange}
              placeholder="e.g. Insulated container, kept warm"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
            />
          </div>
        </div>

        {/* ---- Location ---- */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Pickup Location</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
            <input
              type="text"
              name="pickupAddress"
              value={formData.pickupAddress}
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
                placeholder="e.g. 26.9124"
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
                placeholder="e.g. 75.7873"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
              />
            </div>
          </div>
          <p className="text-xs text-gray-400">
            (Day 19 me hum Google Maps se ye automatically fetch karna sikhayenge — abhi manually daalo. Google Maps pe kisi jagah pe right-click karke coordinates copy kar sakte ho.)
          </p>
        </div>

        {/* ---- Safety Declaration ---- */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.safetyDeclaration}
              onChange={handleCheckboxChange}
              className="mt-1 h-4 w-4 accent-remeal-green"
            />
            <span className="text-sm text-gray-700">
              I confirm this food is <strong>safe, unserved surplus</strong>, has not been
              served on a plate or returned by a customer, and is suitable for redistribution.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-remeal-green text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-60"
        >
          {loading ? "Publishing..." : "Publish Listing"}
        </button>
      </form>
    </div>
  );
};

export default AddFood;