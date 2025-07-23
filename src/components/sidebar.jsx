import React from "react";
import { NavLink } from "react-router-dom";
import { Menu, ChevronLeft, Sun, Moon } from "lucide-react";

export default function Sidebar({
  collapsed,
  onToggle,
  theme,
  toggleTheme,
  title = "Dashboard",
  navItems = [],
}) {
  return (
    <aside
      className={`bg-white dark:bg-gray-800 shadow h-screen flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Top Section with title and collapse button */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-100">
            {title}
          </span>
        )}
        <button onClick={onToggle} className="text-gray-600 dark:text-gray-300">
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2 mt-4 space-y-2">
        {navItems.map(({ name, path, icon }) => (
          <NavLink
            key={path}
            to={path}
            title={collapsed ? name : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              }`
            }
          >
            <span>{icon}</span>
            {!collapsed && <span>{name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Theme Toggle */}
      {toggleTheme && (
        <div className="mt-auto p-4 flex justify-center">
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            className="text-gray-600 dark:text-gray-300"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      )}
    </aside>
  );
}
