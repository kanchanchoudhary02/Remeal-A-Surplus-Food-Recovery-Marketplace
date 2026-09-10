// components/dashboards/AdminDashboard.jsx

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getDashboardStats,
  getAllProviders,
  verifyProvider,
  getAllUsers,
  toggleBlockUser,
} from "../../services/adminService";
import { getAllComplaints, resolveComplaint } from "../../services/complaintService";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [providers, setProviders] = useState([]);
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState("providers"); // providers | users | complaints
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);

  const fetchAll = async () => {
    try {
      const [statsData, providersData, usersData, complaintsData] = await Promise.all([
        getDashboardStats(),
        getAllProviders(),
        getAllUsers(),
        getAllComplaints(),
      ]);
      setStats(statsData.stats);
      setProviders(providersData.providers);
      setUsers(usersData.users);
      setComplaints(complaintsData.complaints);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleVerify = async (id, status) => {
    await verifyProvider(id, status);
    fetchAll();
  };

  const handleBlock = async (id) => {
    await toggleBlockUser(id);
    fetchAll();
  };

  // ✅ NAYA
  const handleResolveComplaint = async (id, status) => {
    setResolvingId(id);
    try {
      const adminNote = window.prompt("Add a note (optional):") || "";
      await resolveComplaint(id, status, adminNote);
      await fetchAll();
    } finally {
      setResolvingId(null);
    }
  };

  if (loading) return <p className="text-center py-16 text-gray-500">Loading...</p>;

  const openComplaintsCount = complaints.filter((c) => c.status === "OPEN").length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name} 👋</h1>
      <p className="text-gray-600 mt-1">Admin Dashboard</p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Providers" value={stats.totalProviders} />
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Meals Rescued" value={stats.mealsRescued} orange />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mt-10 border-b border-gray-200">
        <TabButton label="Providers" active={activeTab === "providers"} onClick={() => setActiveTab("providers")} />
        <TabButton label="All Users" active={activeTab === "users"} onClick={() => setActiveTab("users")} />
        <TabButton
          label={`Complaints${openComplaintsCount > 0 ? ` (${openComplaintsCount})` : ""}`}
          active={activeTab === "complaints"}
          onClick={() => setActiveTab("complaints")}
        />
      </div>

      {/* Providers Tab */}
      {activeTab === "providers" && (
        <div className="mt-4 space-y-3">
          {providers.map((p) => (
            <div
              key={p._id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-900">{p.name}</p>
                <p className="text-xs text-gray-500">
                  {p.email} · {p.providerType?.replace("_", " ")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    p.verificationStatus === "VERIFIED"
                      ? "bg-green-100 text-green-700"
                      : p.verificationStatus === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {p.verificationStatus}
                </span>
                {p.verificationStatus === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleVerify(p._id, "VERIFIED")}
                      className="text-xs bg-remeal-green text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => handleVerify(p._id, "REJECTED")}
                      className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="mt-4 space-y-3">
          {users.map((u) => (
            <div
              key={u._id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {u.name} <span className="text-xs text-gray-400">({u.role})</span>
                </p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>
              <div className="flex items-center gap-2">
                {u.isBlocked && (
                  <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-1 rounded">
                    Blocked
                  </span>
                )}
                {u._id !== user.id && (
                  <button
                    onClick={() => handleBlock(u._id)}
                    className={`text-xs px-3 py-1 rounded ${
                      u.isBlocked
                        ? "bg-green-50 text-green-700 hover:bg-green-100"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                  >
                    {u.isBlocked ? "Unblock" : "Block"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ NAYA — Complaints Tab */}
      {activeTab === "complaints" && (
        <div className="mt-4 space-y-3">
          {complaints.length === 0 ? (
            <p className="text-gray-500 text-sm">No complaints filed yet.</p>
          ) : (
            complaints.map((c) => (
              <div key={c._id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {c.reason.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Filed by {c.filedBy?.name} ({c.filedBy?.role}) ·{" "}
                      {new Date(c.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700 mt-2">{c.description}</p>
                    {c.adminNote && (
                      <p className="text-xs text-gray-400 mt-1 italic">Note: {c.adminNote}</p>
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      c.status === "OPEN"
                        ? "bg-yellow-100 text-yellow-700"
                        : c.status === "RESOLVED"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                {c.status === "OPEN" && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleResolveComplaint(c._id, "RESOLVED")}
                      disabled={resolvingId === c._id}
                      className="text-xs bg-remeal-green text-white px-3 py-1.5 rounded hover:bg-green-700 disabled:opacity-60"
                    >
                      Mark Resolved
                    </button>
                    <button
                      onClick={() => handleResolveComplaint(c._id, "DISMISSED")}
                      disabled={resolvingId === c._id}
                      className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-200 disabled:opacity-60"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, orange }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`text-2xl font-bold mt-1 ${orange ? "text-remeal-orange" : "text-remeal-green"}`}>
      {value}
    </p>
  </div>
);

const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`pb-2 text-sm font-medium ${
      active ? "text-remeal-green border-b-2 border-remeal-green" : "text-gray-500"
    }`}
  >
    {label}
  </button>
);

export default AdminDashboard;