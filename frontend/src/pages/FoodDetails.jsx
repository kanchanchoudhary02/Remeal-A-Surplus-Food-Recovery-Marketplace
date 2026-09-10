// pages/FoodDetails.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFoodById,
  getProviderReviews,
} from "../services/foodService";
import { useCart } from "../context/CartContext";

// ======================================
// Star Rating Component
// ======================================
const StarRating = ({ rating = 0, readOnly = false }) => {
  const roundedRating = Math.round(rating);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={
            star <= roundedRating
              ? "text-yellow-400 text-sm"
              : "text-gray-300 text-sm"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
};

// ======================================
// Food Details Page
// ======================================
const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  // ======================================
  // States
  // ======================================
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  // ======================================
  // Fetch Food Details
  // ======================================
  useEffect(() => {
    const fetchFood = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getFoodById(id);

        // Check food data
        if (!data || !data.foodListing) {
          setError("Food listing not found.");
          return;
        }

        const foodListing = data.foodListing;

        setFood(foodListing);

        // ======================================
        // Fetch Provider Reviews
        // ======================================
        const providerId = foodListing?.providerId?._id;

        if (providerId) {
          try {
            const reviewData = await getProviderReviews(providerId);

            setReviews(reviewData?.reviews || []);
            setAvgRating(reviewData?.averageRating || 0);
          } catch (reviewError) {
            console.error(
              "Failed to fetch provider reviews:",
              reviewError
            );

            // Reviews fail hone par food page break nahi hoga
            setReviews([]);
            setAvgRating(0);
          }
        }
      } catch (err) {
        console.error("Failed to fetch food:", err);

        setError("Food listing not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id]);

  // ======================================
  // Add To Cart
  // ======================================
  const handleAddToCart = () => {
    if (!food) return;

    addToCart(food, quantity);

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  // ======================================
  // Loading
  // ======================================
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">
          Loading...
        </p>
      </div>
    );
  }

  // ======================================
  // Error
  // ======================================
  if (error) {
    return (
      <div className="text-center py-20 px-4">
        <p className="text-red-600 mb-4">
          {error}
        </p>

        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-remeal-green text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  // ======================================
  // No Food
  // ======================================
  if (!food) {
    return null;
  }

  // ======================================
  // Expiry Check
  // ======================================
  const isExpired =
    food.availableUntil &&
    new Date(food.availableUntil) < new Date();

  const isUnavailable =
    isExpired || food.status !== "ACTIVE";

  // ======================================
  // Maximum Quantity
  // ======================================
  const maxQuantity = Number(food.quantity) || 1;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* ==================================
          Back Button
      ================================== */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-remeal-green mb-6 transition-colors"
      >
        ← Back
      </button>

      {/* ==================================
          Main Grid
      ================================== */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* ==================================
            Food Image
        ================================== */}
        <div className="h-64 md:h-80 bg-gray-100 rounded-xl overflow-hidden">

          {food.images && food.images.length > 0 ? (
            <img
              src={food.images[0]}
              alt={food.title || "Food"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}

        </div>

        {/* ==================================
            Food Details
        ================================== */}
        <div>

          {/* Food Title */}
          <h1 className="text-2xl font-bold text-gray-900">
            {food.title}
          </h1>

          {/* Provider */}
          <p className="text-sm text-gray-500 mt-1">
            {food.providerId?.name || "Provider"}

            {food.providerId?.providerType && (
              <>
                {" · "}
                {food.providerId.providerType.replace(
                  "_",
                  " "
                )}
              </>
            )}
          </p>

          {/* ==================================
              Rating
          ================================== */}
          {avgRating > 0 && (
            <div className="flex items-center gap-2 mt-2">

              <StarRating
                rating={avgRating}
                readOnly
              />

              <span className="text-xs text-gray-500">
                ({Number(avgRating).toFixed(1)} ·{" "}
                {reviews.length}{" "}
                {reviews.length === 1
                  ? "review"
                  : "reviews"}
                )
              </span>

            </div>
          )}

          {/* ==================================
              Price
          ================================== */}
          <div className="flex items-center gap-2 mt-4">

            <span className="text-2xl font-bold text-remeal-green">
              {food.price === 0
                ? "Free"
                : `₹${food.price}`}
            </span>

            {food.originalPrice > food.price && (
              <span className="text-gray-400 line-through">
                ₹{food.originalPrice}
              </span>
            )}

          </div>

          {/* ==================================
              Description
          ================================== */}
          {food.description && (
            <p className="text-gray-600 text-sm mt-4 leading-6">
              {food.description}
            </p>
          )}

          {/* ==================================
              Food Information
          ================================== */}
          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">

            {/* Servings */}
            <div>
              <p className="text-gray-500">
                Servings
              </p>

              <p className="font-medium text-gray-900">
                {food.servings || "N/A"}
              </p>
            </div>

            {/* Food Type */}
            <div>
              <p className="text-gray-500">
                Food Type
              </p>

              <p className="font-medium text-gray-900 capitalize">
                {food.foodType
                  ? food.foodType.replace("_", " ")
                  : "N/A"}
              </p>
            </div>

            {/* Available Until */}
            <div>
              <p className="text-gray-500">
                Available Until
              </p>

              <p className="font-medium text-gray-900">
                {food.availableUntil
                  ? new Date(
                      food.availableUntil
                    ).toLocaleString()
                  : "N/A"}
              </p>
            </div>

            {/* Consume Before */}
            <div>
              <p className="text-gray-500">
                Consume Before
              </p>

              <p className="font-medium text-gray-900">
                {food.consumeBefore
                  ? new Date(
                      food.consumeBefore
                    ).toLocaleString()
                  : "N/A"}
              </p>
            </div>

          </div>

          {/* ==================================
              Quantity Available
          ================================== */}
          <div className="mt-4 text-sm">

            <p className="text-gray-500">
              Available Quantity
            </p>

            <p className="font-medium text-gray-900">
              {food.quantity || 0}
            </p>

          </div>

          {/* ==================================
              Pickup Location
          ================================== */}
          {food.pickupLocation?.address && (
            <div className="mt-4 text-sm">

              <p className="text-gray-500">
                Pickup Location
              </p>

              <p className="font-medium text-gray-900">
                {food.pickupLocation.address}
              </p>

            </div>
          )}

          {/* ==================================
              Status / Order
          ================================== */}
          {isUnavailable ? (

            <div className="mt-6">

              <p className="text-red-600 font-medium text-sm">
                This listing is no longer available.
              </p>

            </div>

          ) : (

            <div className="mt-6 flex items-center gap-3">

              {/* ==================================
                  Quantity Selector
              ================================== */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">

                {/* Minus */}
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      Math.max(1, q - 1)
                    )
                  }
                  disabled={quantity <= 1}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  −
                </button>

                {/* Quantity */}
                <span className="px-4 text-sm font-medium">
                  {quantity}
                </span>

                {/* Plus */}
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(
                        maxQuantity,
                        q + 1
                      )
                    )
                  }
                  disabled={quantity >= maxQuantity}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>

              </div>

              {/* ==================================
                  Order Button
              ================================== */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 bg-remeal-green text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                {added
                  ? "Added ✓"
                  : "Order Now"}
              </button>

            </div>

          )}

        </div>
      </div>

      {/* ======================================
          Reviews Section
      ====================================== */}
      {reviews.length > 0 && (
        <div className="mt-12 border-t pt-8">

          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Customer Reviews
          </h2>

          <div className="space-y-4">

            {reviews.map((review, index) => (
              <div
                key={
                  review._id || index
                }
                className="border border-gray-200 rounded-xl p-4"
              >

                <div className="flex items-center justify-between">

                  <p className="font-medium text-gray-900">
                    {review.userId?.name ||
                      review.user?.name ||
                      review.name ||
                      "Customer"}
                  </p>

                  <StarRating
                    rating={review.rating || 0}
                    readOnly
                  />

                </div>

                {review.comment && (
                  <p className="text-sm text-gray-600 mt-2">
                    {review.comment}
                  </p>
                )}

                {review.createdAt && (
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(
                      review.createdAt
                    ).toLocaleDateString()}
                  </p>
                )}

              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  );
};

export default FoodDetails;