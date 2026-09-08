// components/dashboards/AdminDashboard.jsx

import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name} 👋</h1>
      <p className="text-gray-600 mt-1">Admin Dashboard</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold text-remeal-green mt-1">0</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Providers</p>
          <p className="text-2xl font-bold text-remeal-green mt-1">0</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Orders</p>
          <p className="text-2xl font-bold text-remeal-green mt-1">0</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Meals Rescued</p>
          <p className="text-2xl font-bold text-remeal-orange mt-1">0</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-8">
        (Real analytics Day 24-27 me banenge)
      </p>
    </div>
  );
};

export default AdminDashboard;