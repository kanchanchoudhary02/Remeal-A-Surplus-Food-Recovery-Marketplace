// components/StarRating.jsx
// Reusable — "input mode" (click karke rating do) aur "display mode" (sirf dikhao) dono ke liye

const StarRating = ({ rating, onChange, readOnly = false }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange && onChange(star)}
          className={`text-xl ${readOnly ? "cursor-default" : "cursor-pointer"} ${
            star <= rating ? "text-remeal-orange" : "text-gray-300"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRating;