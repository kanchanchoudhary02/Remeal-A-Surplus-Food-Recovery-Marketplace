// layouts/Layout.jsx
// Ye "wrapper" hai — Navbar + Footer common rakhta hai, beech me jo bhi page
// hoga wo <Outlet/> ki jagah render hoga

import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;