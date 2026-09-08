// components/dashboards/ProviderDashboard.jsx

import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const ProviderDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome, {user.name} 👋
      </h1>
      <p className="text-gray-600 mt-1">
        {user.providerType ? user.providerType.replace("_", " ") : "Provider"} Dashboard
      </p>

      {/* Stats cards — abhi hardcoded, Day 9-10 se real data aayega */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Active Listings</p>
          <p className="text-3xl font-bold text-remeal-green mt-1">0</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-3xl font-bold text-remeal-green mt-1">0</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Meals Rescued</p>
          <p className="text-3xl font-bold text-remeal-orange mt-1">0</p>
        </div>
      </div>

      <Link
  to="/add-food"
  className="inline-block mt-8 bg-remeal-green text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
>
  + Add Surplus Food
</Link>

      <p className="text-xs text-gray-400 mt-3">
        (Ye button Day 10 me kaam karna shuru karega — abhi UI-only hai)
      </p>
    </div>
  );
};

export default ProviderDashboard;