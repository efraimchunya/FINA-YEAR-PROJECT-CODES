import React, { useState, useRef, useEffect } from "react";
import { LogOut, Settings } from "lucide-react";
import { toast } from "react-toastify";

export default function ProfileDropdown({ user, theme = "light", onLogout, onSettings }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-2 py-1 rounded-full focus:outline-none"
        aria-label="Profile Menu"
      >
        <span className="text-sm font-medium text-gray-700 dark:text-white">
          Welcome, <strong>{user.name}</strong>
        </span>
        {user.avatarUrl || user.image ? (
          <img
            src={user.avatarUrl || user.image}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-green-600"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "";
            }}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-green-600 text-white font-bold flex items-center justify-center">
            {initials}
          </div>
        )}
      </button>

      {open && (
        <div
          className={`absolute right-0 mt-2 w-48 z-50 shadow-lg rounded-md border ${
            theme === "dark"
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-gray-900 border-gray-200"
          }`}
        >
          <button
            onClick={() => {
              setOpen(false);
              onSettings ? onSettings() : toast.info("Settings not implemented yet.");
            }}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-green-600 hover:text-white text-sm"
          >
            <Settings size={16} /> Settings
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onLogout?.();
            }}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-600 hover:text-white text-sm"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
