// pages/Dashboard.jsx
// Ye component khud UI nahi banata — sirf decide karta hai
// user.role ke hisaab se KAUNSA dashboard dikhana hai.

import { useAuth } from "../context/AuthContext";
import ProviderDashboard from "../components/dashboards/ProviderDashboard";
import BuyerDashboard from "../components/dashboards/BuyerDashboard";
import DeliveryDashboard from "../components/dashboards/DeliveryDashboard";
import AdminDashboard from "../components/dashboards/AdminDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  // Safety check — agar kisi wajah se user null ho (theoretically ProtectedRoute
  // isse pehle hi rok deta hai, but extra safety kabhi bura nahi)
  if (!user) return null;

  const renderDashboard = () => {
    switch (user.role) {
      case "provider":
        return <ProviderDashboard />;
      case "buyer":
        return <BuyerDashboard />;
      case "delivery":
        return <DeliveryDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <p>Unknown role.</p>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;