import React, { useState, useEffect } from "react";
import { Bell } from "react-feather";
import { useAuth } from "../../../Contexts/AuthContext";
import { useLocation, Link } from "react-router-dom";
import { getUnreadMessage } from "../../../services/chat.service";
function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const [unreadCount, setUnreadCount] = useState(0);
  // Fetch unread count
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        if (!user?.user_id) return;
        const res = await getUnreadMessage(user.user_id);
        setUnreadCount(res.data.totalUnread || 0);
      } catch (err) {
        console.error("Error fetching unread count:", err);
      }
    };

    fetchUnread();
    // Optional: refresh every 10 seconds
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, [user?.user_id]);
  
  console.log("Full user object:", `http://localhost:8080${user?.profile_img}`);

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 justify-between items-center hidden md:flex">
      <h2 className="text-xl font-semibold text-dark">
        {currentPath === "/profile"
          ? "Profile"
          : "/chat"
          ? "Messaging"
          : "Dashboard"}
      </h2>
      <div className="flex items-center space-x-2 md:space-x-4">
        <Link to="/chat" className="relative">
          <Bell className="w-5 h-5 text-gray-500" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
        <img
          src={
            user?.profile_img
              ? `http://localhost:8080${user.profile_img}`
              : "/Image/profile.jpg"
          }
          className="w-8 h-8 rounded-full hidden sm:block"
        />
      </div>
    </header>
  );
}

export default Header;
