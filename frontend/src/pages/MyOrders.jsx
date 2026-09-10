// pages/MyOrders.jsx

import { useState, useEffect } from "react";
import { getMyOrders } from "../services/orderService";
import { createReview } from "../services/reviewService";
import StarRating from "../components/StarRating";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null); // kaunsa order abhi review form dikha raha hai
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data.orders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openReviewForm = (orderId) => {
    setReviewingId(orderId);
    setRating(0);
    setComment("");
  };

  const handleSubmitReview = async (orderId) => {
    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }
    setSubmitting(true);
    try {
      await createReview(orderId, rating, comment);
      setReviewingId(null);
      await fetchOrders(); // taaki "already reviewed" ka pata chal jaye
      alert("Thanks for your review!");
    } catch (err) {
      alert(err.response?.data?.message || "Could not submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center py-16 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex justify-between items-start">
                <div>
                  {order.items.map((item, i) => (
                    <p key={i} className="text-sm text-gray-700">
                      {item.title} × {item.quantity}
                    </p>
                  ))}
                </div>
                <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {order.status.replace(/_/g, " ")}
                </span>
              </div>
              <p className="text-sm font-bold text-gray-900 mt-3">₹{order.totalAmount}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(order.createdAt).toLocaleString()}
              </p>

              {/* ✅ NAYA — sirf DELIVERED orders pe review option */}
              {order.status === "DELIVERED" && (
                <div className="mt-3">
                  {reviewingId === order._id ? (
                    <div className="bg-gray-50 rounded-lg p-4 mt-2 space-y-3">
                      <StarRating rating={rating} onChange={setRating} />
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="How was your experience? (optional)"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-remeal-green"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSubmitReview(order._id)}
                          disabled={submitting}
                          className="bg-remeal-green text-white text-sm px-4 py-1.5 rounded-lg hover:bg-green-700 disabled:opacity-60"
                        >
                          {submitting ? "Submitting..." : "Submit Review"}
                        </button>
                        <button
                          onClick={() => setReviewingId(null)}
                          className="text-sm text-gray-500 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => openReviewForm(order._id)}
                      className="text-sm text-remeal-green font-medium hover:underline"
                    >
                      Rate this order
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;