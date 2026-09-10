// components/NotificationBell.jsx

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyNotifications, markAllAsRead } from "../services/notificationService";

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const data = await getMyNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      // silently fail — notification na aana koi critical error nahi hai
    }
  };

  // ✅ Polling — har 30 second me automatically check karo
  useEffect(() => {
    if (!user) return;

    fetchNotifications(); // turant ek baar
    const interval = setInterval(fetchNotifications, 30000); // phir har 30 sec

    return () => clearInterval(interval); // cleanup — component hatte hi polling band
  }, [user]);

  // ✅ Bahar click karne pe dropdown band ho jaye
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = async () => {
    setOpen((prev) => !prev);
    if (unreadCount > 0) {
      await markAllAsRead();
      setUnreadCount(0);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={handleOpen} className="relative p-2 text-gray-600 hover:text-remeal-green">
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-remeal-orange text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          <div className="p-3 border-b border-gray-100 font-semibold text-sm text-gray-800">
            Notifications
          </div>
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-gray-500 text-center">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`p-3 border-b border-gray-50 text-sm ${
                  n.read ? "text-gray-500" : "text-gray-900 bg-green-50/50"
                }`}
              >
                <p>{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;