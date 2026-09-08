// pages/MyOrders.jsx

import { useState, useEffect } from "react";
import { getMyOrders } from "../services/orderService";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data.orders);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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
                  {order.status}
                </span>
              </div>
              <p className="text-sm font-bold text-gray-900 mt-3">₹{order.totalAmount}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;