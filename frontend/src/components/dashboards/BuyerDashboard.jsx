// components/dashboards/BuyerDashboard.jsx

import { useAuth } from "../../context/AuthContext";

const BuyerDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name} 👋</h1>
      <p className="text-gray-600 mt-1">Find surplus food near you</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">My Orders</p>
          <p className="text-3xl font-bold text-remeal-green mt-1">0</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Food Rescued (by you)</p>
          <p className="text-3xl font-bold text-remeal-orange mt-1">0 kg</p>
        </div>
      </div>

      <button className="mt-8 bg-remeal-green text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors">
        Explore Nearby Food
      </button>

      <p className="text-xs text-gray-400 mt-3">
        (Marketplace Day 12 me banega — abhi UI-only hai)
      </p>
    </div>
  );
};

export default BuyerDashboard;