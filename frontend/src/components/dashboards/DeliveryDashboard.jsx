// components/dashboards/DeliveryDashboard.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAvailableDeliveries, acceptDelivery } from "../../services/orderService";
// import { Link } from "react-router-dom"
const DeliveryDashboard = () => {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);

  const fetchDeliveries = async () => {
    try {
      const data = await getAvailableDeliveries();
      setDeliveries(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleAccept = async (orderId) => {
    setAcceptingId(orderId);
    try {
      await acceptDelivery(orderId);
      await fetchDeliveries(); // list refresh — accepted wala ab "available" me nahi dikhega
      alert("Delivery accepted! Check 'My Deliveries' to proceed.");
    } catch (err) {
      alert(err.response?.data?.message || "Could not accept delivery.");
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name} 👋</h1>
      <p className="text-gray-600 mt-1">Delivery Partner Dashboard</p>
       
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <Link
  to="/my-deliveries"
  className="inline-block mt-6 text-sm font-medium text-remeal-green hover:underline"
>
  View My Deliveries →
</Link>
          <p className="text-sm text-gray-500">Available Deliveries</p>
          <p className="text-3xl font-bold text-remeal-green mt-1">{deliveries.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Total Earnings</p>
          <p className="text-3xl font-bold text-remeal-orange mt-1">₹0</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mt-10 mb-4">Available Deliveries</h2>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : deliveries.length === 0 ? (
        <p className="text-gray-500 text-sm">No deliveries available right now.</p>
      ) : (
        <div className="space-y-3">
          {deliveries.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-200 rounded-lg p-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Pickup: {order.items[0]?.providerId?.name || "Provider"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {order.items[0]?.providerId?.address}
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-2">
                    Drop: {order.buyerId?.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{order.buyerId?.address}</p>
                </div>
                <span className="text-sm font-bold text-remeal-green">
                  ₹{order.deliveryFee}
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

              <button
                onClick={() => handleAccept(order._id)}
                disabled={acceptingId === order._id}
                className="mt-4 bg-remeal-green text-white text-sm px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-60"
              >
                {acceptingId === order._id ? "Accepting..." : "Accept Delivery"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;