// components/dashboards/DeliveryDashboard.jsx

import { useAuth } from "../../context/AuthContext";

const DeliveryDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name} 👋</h1>
      <p className="text-gray-600 mt-1">Delivery Partner Dashboard</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Deliveries Completed</p>
          <p className="text-3xl font-bold text-remeal-green mt-1">0</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Total Earnings</p>
          <p className="text-3xl font-bold text-remeal-orange mt-1">₹0</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-8">
        (Available Deliveries list Day 17 me banega)
      </p>
    </div>
  );
};

export default DeliveryDashboard;