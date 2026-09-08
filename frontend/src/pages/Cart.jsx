// pages/Cart.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../services/orderService";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const deliveryFee = items.length > 0 ? 30 : 0;
  const platformFee = items.length > 0 ? 10 : 0;
  const total = subtotal + deliveryFee + platformFee;

  const handlePlaceOrder = async () => {
    setError("");
    setPlacing(true);
    try {
      const orderItems = items.map((item) => ({
        foodListingId: item.food._id,
        quantity: item.quantity,
      }));

      await placeOrder(orderItems);
      clearCart();
      navigate("/my-orders");
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order. Try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Your cart is empty.</p>
        <button
          onClick={() => navigate("/explore")}
          className="mt-4 text-remeal-green font-medium hover:underline"
        >
          Explore surplus food →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.food._id}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4"
          >
            <div>
              <p className="font-medium text-gray-900">{item.food.title}</p>
              <p className="text-sm text-gray-500">
                {item.food.price === 0 ? "Free" : `₹${item.food.price}`} each
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => updateQuantity(item.food._id, item.quantity - 1)}
                  className="px-2.5 py-1 text-gray-600 hover:bg-gray-50"
                >
                  −
                </button>
                <span className="px-3 text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.food._id, item.quantity + 1)}
                  className="px-2.5 py-1 text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.food._id)}
                className="text-red-500 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mt-6 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Delivery Fee</span>
          <span>₹{deliveryFee}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Platform Fee</span>
          <span>₹{platformFee}</span>
        </div>
        <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={placing}
        className="w-full mt-6 bg-remeal-green text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-60"
      >
        {placing ? "Placing order..." : "Place Order"}
      </button>

      <p className="text-xs text-gray-400 text-center mt-3">
        (Payment abhi integrate nahi hai — Day 22 me Razorpay add karenge. Abhi order sirf record hota hai.)
      </p>
    </div>
  );
};

export default Cart;