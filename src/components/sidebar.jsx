import React from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";

export default function Sidebar({
  collapsed,
  onToggle,
  theme,
  toggleTheme,
  title = "Dashboard",
  navItems = [],
}) {
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-30 bg-black bg-opacity-40 md:hidden transition-opacity ${
          collapsed ? "hidden" : "block"
        }`}
        onClick={onToggle}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out
          ${collapsed ? "-translate-x-full" : "translate-x-0"}
          w-64 md:translate-x-0 md:static md:block`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-100">
            {title}
          </span>
          <button
            onClick={onToggle}
            className="text-gray-600 dark:text-gray-300 md:hidden"
          >
            {collapsed ? <Menu size={24} /> : <X size={24} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 mt-4 space-y-2">
          {navItems.map(({ name, path, icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onToggle} // Close on mobile when link is clicked
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`
              }
            >
              <span>{icon}</span>
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Theme toggle */}
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
    </>
  );
}
