// pages/MyDeliveries.jsx

import { useState, useEffect } from "react";
import { getMyDeliveries, updateDeliveryStatus } from "../services/orderService";

const nextStatusMap = {
  READY_FOR_PICKUP: { next: "PICKED_UP", label: "Mark Picked Up" },
  PICKED_UP: { next: "ON_THE_WAY", label: "Mark On The Way" },
  ON_THE_WAY: { next: "DELIVERED", label: "Mark Delivered" },
};

const statusColors = {
  READY_FOR_PICKUP: "bg-purple-100 text-purple-700",
  PICKED_UP: "bg-indigo-100 text-indigo-700",
  ON_THE_WAY: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-green-100 text-green-700",
};

const MyDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchDeliveries = async () => {
    try {
      const data = await getMyDeliveries();
      setDeliveries(data.orders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateDeliveryStatus(orderId, newStatus);
      await fetchDeliveries();
    } catch (err) {
      alert(err.response?.data?.message || "Could not update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="text-center py-16 text-gray-500">Loading...</p>;

  // Active (not yet delivered) aur completed deliveries alag dikhate hain
  const active = deliveries.filter((o) => o.status !== "DELIVERED");
  const completed = deliveries.filter((o) => o.status === "DELIVERED");

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Deliveries</h1>

      <h2 className="text-lg font-semibold text-gray-800 mb-3">Active</h2>
      {active.length === 0 ? (
        <p className="text-gray-500 text-sm mb-8">No active deliveries.</p>
      ) : (
        <div className="space-y-4 mb-10">
          {active.map((order) => {
            const action = nextStatusMap[order.status];
            return (
              <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Pickup: {order.items[0]?.providerId?.name}
                    </p>
                    <p className="text-xs text-gray-500">{order.items[0]?.providerId?.address}</p>
                    <p className="text-sm font-medium text-gray-900 mt-2">
                      Drop: {order.buyerId?.name} · {order.buyerId?.phone}
                    </p>
                    <p className="text-xs text-gray-500">{order.buyerId?.address}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      statusColors[order.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  {order.items.map((item, i) => (
                    <span key={i}>
                      {item.title} × {item.quantity}
                      {i < order.items.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>

                <p className="text-sm font-bold text-remeal-green mt-2">
                  Earning: ₹{order.deliveryFee}
                </p>

                {action && (
                  <button
                    onClick={() => handleUpdate(order._id, action.next)}
                    disabled={updatingId === order._id}
                    className="mt-4 bg-remeal-green text-white text-sm px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-60"
                  >
                    {updatingId === order._id ? "Updating..." : action.label}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-800 mb-3">Completed</h2>
      {completed.length === 0 ? (
        <p className="text-gray-500 text-sm">No completed deliveries yet.</p>
      ) : (
        <div className="space-y-3">
          {completed.map((order) => (
            <div
              key={order._id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-700">{order.items[0]?.title} and others</p>
                <p className="text-xs text-gray-400">
                  {new Date(order.updatedAt).toLocaleString()}
                </p>
              </div>
              <span className="text-sm font-medium text-remeal-green">
                +₹{order.deliveryFee}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDeliveries;