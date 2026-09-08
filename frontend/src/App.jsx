// App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AddFood from "./pages/AddFood";
import Explore from "./pages/Explore";
import { CartProvider } from "./context/CartContext";
import FoodDetails from "./pages/FoodDetails";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import MyDeliveries from "./pages/MyDeliveries";
import CreateFoodRequest from "./pages/CreateFoodRequest";
import FoodRequests from "./pages/FoodRequests";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="explore" element={<Explore />} />
              <Route path="food/:id" element={<FoodDetails />} />       {/* ✅ NAYA */}
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="my-deliveries" element={<ProtectedRoute><MyDeliveries /></ProtectedRoute>} />
              <Route path="create-request" element={<ProtectedRoute><CreateFoodRequest /></ProtectedRoute>} />
<Route path="food-requests" element={<ProtectedRoute><FoodRequests /></ProtectedRoute>} />
              <Route path="add-food" element={<ProtectedRoute><AddFood /></ProtectedRoute>} />
              <Route path="my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
         <Route path="my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />   {/* ✅ NAYA */}
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
export default App;