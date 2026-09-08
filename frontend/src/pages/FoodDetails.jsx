// pages/FoodDetails.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFoodById } from "../services/foodService";
import { useCart } from "../context/CartContext";

const FoodDetails = () => {
  const { id } = useParams(); // URL se :id nikalta hai (jaise /food/64fa2b... → id = "64fa2b...")
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const data = await getFoodById(id);
        setFood(data.foodListing);
      } catch (err) {
        setError("Food listing not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, [id]); // agar id badle (naya food dekha), dobara fetch karo

  const handleAddToCart = () => {
    addToCart(food, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500); // 1.5 sec baad button wapas normal
  };

  if (loading) return <p className="text-center py-16 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center py-16 text-red-600">{error}</p>;
  if (!food) return null;

  const isExpired = new Date(food.availableUntil) < new Date();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-remeal-green mb-4"
      >
        ← Back
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="h-64 md:h-80 bg-gray-100 rounded-xl overflow-hidden">
          {food.images && food.images.length > 0 ? (
            <img src={food.images[0]} alt={food.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{food.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {food.providerId?.name} · {food.providerId?.providerType?.replace("_", " ")}
          </p>

          <div className="flex items-center gap-2 mt-4">
            <span className="text-2xl font-bold text-remeal-green">
              {food.price === 0 ? "Free" : `₹${food.price}`}
            </span>
            {food.originalPrice > food.price && (
              <span className="text-gray-400 line-through">₹{food.originalPrice}</span>
            )}
          </div>

          {food.description && (
            <p className="text-gray-600 text-sm mt-4">{food.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div>
              <p className="text-gray-500">Servings</p>
              <p className="font-medium text-gray-900">{food.servings}</p>
            </div>
            <div>
              <p className="text-gray-500">Food Type</p>
              <p className="font-medium text-gray-900 capitalize">
                {food.foodType.replace("_", " ")}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Available Until</p>
              <p className="font-medium text-gray-900">
                {new Date(food.availableUntil).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Consume Before</p>
              <p className="font-medium text-gray-900">
                {new Date(food.consumeBefore).toLocaleString()}
              </p>
            </div>
          </div>

          {food.pickupLocation?.address && (
            <div className="mt-4 text-sm">
              <p className="text-gray-500">Pickup Location</p>
              <p className="font-medium text-gray-900">{food.pickupLocation.address}</p>
            </div>
          )}

          {isExpired || food.status !== "ACTIVE" ? (
            <p className="mt-6 text-red-600 font-medium text-sm">
              This listing is no longer available.
            </p>
          ) : (
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                >
                  −
                </button>
                <span className="px-4 text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(food.quantity, q + 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-remeal-green text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                {added ? "Added ✓" : "Order Now"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;