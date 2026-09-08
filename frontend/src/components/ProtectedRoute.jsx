// components/ProtectedRoute.jsx
// Ye component kisi bhi page ko "wrap" karke usse protect kar deta hai —
// agar user login nahi hai, to /login pe bhej dega.

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Jab tak localStorage check ho raha hai (Day 7 Step 1 ka useEffect), wait karo
  if (loading) {
    return <div className="text-center py-16">Loading...</div>;
  }

  // Login nahi hai to /login pe redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Login hai to jo bhi page andar tha, wo render karo
  return children;
};

export default ProtectedRoute;