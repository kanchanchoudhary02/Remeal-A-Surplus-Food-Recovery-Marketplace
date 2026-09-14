// components/FoodCard.jsx
// Ek reusable card — Explore page, aur baad me Provider "My Listings" page
// (Day 16) dono isko use karenge

import { Link } from "react-router-dom";

const FoodCard = ({ food }) => {
  // Time remaining calculate karo (simple version — Day 26 me isse "urgent" badge
  // ke saath aur polish karenge)
  const getTimeRemaining = () => {
    const now = new Date();
    const until = new Date(food.availableUntil);
    const diffMs = until - now;

    if (diffMs <= 0) return "Expired";

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) return `${diffHours}h ${diffMinutes}m left`;
    return `${diffMinutes}m left`;
  };

  const discountPercent =
    food.originalPrice > 0
      ? Math.round(((food.originalPrice - food.price) / food.originalPrice) * 100)
      : 0;

  return (
    <Link
      to={`/food/${food._id}`}
      className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div className="h-40 bg-gray-100 relative">
        {food.images && food.images.length > 0 ? (
          <img
            src={food.images[0]}
            alt={food.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}

        {food.price === 0 && (
          <span className="absolute top-2 left-2 bg-remeal-green text-white text-xs font-semibold px-2 py-1 rounded">
            FREE
          </span>
        )}

        <span className="absolute top-2 right-2 bg-white/90 text-gray-700 text-xs font-medium px-2 py-1 rounded">
          {getTimeRemaining()}
        </span>
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">{food.title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          {food.providerId?.name} · {food.providerId?.providerType?.replace("_", " ")}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-remeal-green">
            {food.price === 0 ? "Free" : `₹${food.price}`}
          </span>
          {food.originalPrice > food.price && (
            <>
              <span className="text-xs text-gray-400 line-through">
                ₹{food.originalPrice}
              </span>
              {discountPercent > 0 && (
                <span className="text-xs text-remeal-orange font-medium">
                  {discountPercent}% off
                </span>
              )}
            </>
          )}
        </div>

    <div className="flex items-center gap-2 mt-1">
  <p className="text-xs text-gray-500">{food.servings} servings</p>
  {food.distance !== undefined && (
    <>
      <span className="text-gray-300">·</span>
      <p className="text-xs text-gray-500">{food.distance} km away</p>
      <h1>kanchan</h1>
    </>
  
  )}
</div>
      </div>
    </Link>
  );
};

export default FoodCard;