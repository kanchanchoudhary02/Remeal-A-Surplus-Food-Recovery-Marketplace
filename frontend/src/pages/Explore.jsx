// pages/Explore.jsx

import { useState, useEffect } from "react";
import { getFoods } from "../services/foodService";
import FoodCard from "../components/FoodCard";

const Explore = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ NAYA — filter states
  const [search, setSearch] = useState("");
  const [foodType, setFoodType] = useState("");
  const [isFree, setIsFree] = useState(false);

  // ✅ NAYA — jab bhi koi filter badle, dobara fetch karo
  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      setError("");
      try {
        const filters = {};
        if (search) filters.search = search;
        if (foodType) filters.foodType = foodType;
        if (isFree) filters.isFree = true;

        const data = await getFoods(filters);
        setFoods(data.foodListings);
      } catch (err) {
        setError("Could not load food listings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // ✅ Debounce — user ke type karna band karne ke 400ms baad hi search chalao,
    // warna har letter type karte hi API call chali jayegi (slow aur wasteful)
    const timer = setTimeout(fetchFoods, 400);
    return () => clearTimeout(timer); // pichla timer cancel karo agar naya change aa gaya
  }, [search, foodType, isFree]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Explore Surplus Food</h1>
      <p className="text-gray-600 text-sm mt-1">
        Safe, unserved surplus food available near you
      </p>

      {/* ---- Search + Filters ---- */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search food (e.g. Paneer Rice)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
        />

        <select
          value={foodType}
          onChange={(e) => setFoodType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-remeal-green"
        >
          <option value="">All Food Types</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="non_vegetarian">Non-Vegetarian</option>
          <option value="vegan">Vegan</option>
        </select>

        <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer text-sm text-gray-700">
          <input
            type="checkbox"
            checked={isFree}
            onChange={(e) => setIsFree(e.target.checked)}
            className="accent-remeal-green"
          />
          Free Food Only
        </label>
      </div>

      {/* Loading state */}
      {loading && (
        <p className="text-gray-500 mt-10 text-center">Loading food listings...</p>
      )}

      {/* Error state */}
      {error && <p className="text-red-600 mt-10 text-center">{error}</p>}

      {/* Empty state */}
      {!loading && !error && foods.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500">No surplus food matches your search.</p>
          <p className="text-gray-400 text-sm mt-1">Try changing your filters.</p>
        </div>
      )}

      {/* Food grid */}
      {!loading && !error && foods.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-8">
          {foods.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;