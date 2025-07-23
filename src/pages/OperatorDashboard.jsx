import React, { useEffect, useState } from "react";
import { ZanzibarMap } from "../components/ZanzibarMap";
import {
  getLocations,
  createActivity,
  getAllBookings,
  updateBooking,
} from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Moon, Sun, LogOut } from "lucide-react";

export default function OperatorDashboard() {
  const [locations, setLocations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [newActivity, setNewActivity] = useState({ name: "", description: "", price: "" });
  const [bookingFilter, setBookingFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("map");
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showBookingDetailsModal, setShowBookingDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-gray-900", "text-white");
      document.body.classList.remove("bg-gray-100", "text-gray-900");
    } else {
      document.body.classList.remove("bg-gray-900", "text-white");
      document.body.classList.add("bg-gray-100", "text-gray-900");
    }
  }, [darkMode]);

  const refresh = () => {
    getLocations()
      .then((res) => setLocations(res.data))
      .catch(() => toast.error("Failed to load locations"));
    getAllBookings()
      .then((res) => setBookings(res.data))
      .catch(() => toast.error("Failed to load bookings"));
  };

  const handleOpenAddActivity = (locationId) => {
    setSelectedLocationId(locationId);
    setShowAddActivityModal(true);
  };

  const handleCreateActivity = () => {
    const { name, description, price } = newActivity;
    if (!name.trim()) return toast.error("Activity name is required.");
    createActivity({
      location_id: selectedLocationId,
      name: name.trim(),
      description: description || "No description",
      price: parseFloat(price) || 0,
    })
      .then(() => {
        toast.success("Activity created!");
        setShowAddActivityModal(false);
        setNewActivity({ name: "", description: "", price: "" });
        refresh();
      })
      .catch(() => toast.error("Failed to create activity"));
  };

  const handleBookingUpdate = (id, newStatus) => {
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    const normalizedStatus = capitalize(newStatus);

    updateBooking(id, { status: normalizedStatus })
      .then(() => {
        toast.success(`Booking ${normalizedStatus}!`);
        refresh();
        setShowBookingDetailsModal(false);
      })
      .catch(() => toast.error(`Failed to ${newStatus} booking`));
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === "all") return true;
    return b.status.toLowerCase() === bookingFilter;
  });

  const handleLogout = () => {
    toast.info("Logging out...");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

  const openBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowBookingDetailsModal(true);
  };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Sidebar */}
      <aside className={`w-60 p-4 flex flex-col justify-between ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-r border-gray-300"}`}>
        <div>
          <h2 className="text-xl font-bold mb-6 text-blue-500">Operator Panel</h2>
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("map")}
              className={`py-2 px-3 rounded text-left ${
                activeTab === "map"
                  ? "bg-blue-600 text-white"
                  : darkMode
                  ? "hover:bg-gray-700"
                  : "hover:bg-blue-100"
              }`}
            >
              Map & Add Activity
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`py-2 px-3 rounded text-left ${
                activeTab === "bookings"
                  ? "bg-blue-600 text-white"
                  : darkMode
                  ? "hover:bg-gray-700"
                  : "hover:bg-blue-100"
              }`}
            >
              Manage Bookings
            </button>
          </nav>
        </div>

        <div className="mt-6 flex flex-col gap-3 items-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark/light mode"
            className={`w-10 h-10 flex items-center justify-center rounded-full
              ${darkMode ? "bg-yellow-400 text-black" : "bg-gray-700 text-white"}
              transition-colors duration-300`}
          >
            {darkMode ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2 flex items-center justify-center gap-2 rounded bg-red-600 hover:bg-red-700 text-white"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

        {activeTab === "map" && (
          <>
            <div className="relative z-10" style={{ height: "500px" }}>
              <ZanzibarMap
                locations={locations}
                onAddActivity={handleOpenAddActivity}
                mode="operator"
              />
            </div>

            {showAddActivityModal && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                <div className={`rounded-lg w-full max-w-md p-6 shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
                  <h3 className="text-lg font-semibold mb-4">Add Activity</h3>
                  <input
                    type="text"
                    placeholder="Activity name"
                    className={`w-full mb-3 p-2 border rounded ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                    value={newActivity.name}
                    onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                  />
                  <textarea
                    placeholder="Description"
                    className={`w-full mb-3 p-2 border rounded ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Price (USD)"
                    className={`w-full mb-4 p-2 border rounded ${
                      darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                    value={newActivity.price}
                    onChange={(e) => setNewActivity({ ...newActivity, price: e.target.value })}
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowAddActivityModal(false)}
                      className={`px-4 py-2 rounded ${
                        darkMode ? "bg-gray-600 hover:bg-gray-700 text-white" : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateActivity}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "bookings" && (
          <>
            <div className="mb-4 flex gap-2">
              {["all", "pending", "approved", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setBookingFilter(status)}
                  className={`px-4 py-1 rounded border ${
                    bookingFilter === status
                      ? "bg-blue-600 text-white"
                      : darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {filteredBookings.length === 0 ? (
              <p className={darkMode ? "text-gray-300" : "text-gray-600"}>No bookings found.</p>
            ) : (
              <ul className="space-y-4">
                {filteredBookings.map((b) => (
                  <li
                    key={b.id}
                    className={`p-4 rounded-lg shadow-md ${
                      b.status.toLowerCase() === "pending"
                        ? "bg-yellow-100 text-black"
                        : b.status.toLowerCase() === "approved"
                        ? "bg-green-100 text-black"
                        : b.status.toLowerCase() === "rejected"
                        ? "bg-red-100 text-black"
                        : "bg-gray-100 text-black"
                    } cursor-pointer`}
                    onClick={() => openBookingDetails(b)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div>
                        <p className="text-md font-semibold">{b.full_name}</p>
                        <p className="text-sm">
                          {b.activity_name} at {b.location_name}
                        </p>
                      </div>
                      {b.status.toLowerCase() === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookingUpdate(b.id, "approved");
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookingUpdate(b.id, "rejected");
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                    {b.notes && (
                      <p className="text-xs italic mt-1">
                        Notes: {b.notes}
                      </p>
                    )}
                    <div className="text-xs mt-1">
                      Status: <span className="capitalize">{b.status}</span> |{" "}
                      {new Date(b.date).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {showBookingDetailsModal && selectedBooking && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                <div className={`rounded-lg w-full max-w-md p-6 shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
                  <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
                  <p><strong>Full Name:</strong> {selectedBooking.full_name}</p>
                  <p><strong>Activity:</strong> {selectedBooking.activity_name}</p>
                  <p><strong>Location:</strong> {selectedBooking.location_name}</p>
                  {selectedBooking.notes && <p><strong>Notes:</strong> {selectedBooking.notes}</p>}
                  <p><strong>Status:</strong> <span className="capitalize">{selectedBooking.status}</span></p>
                  <p><strong>Date:</strong> {new Date(selectedBooking.date).toLocaleString()}</p>

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => setShowBookingDetailsModal(false)}
                      className={`px-4 py-2 rounded ${
                        darkMode ? "bg-gray-600 hover:bg-gray-700 text-white" : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    >
                      Close
                    </button>
                    {selectedBooking.status.toLowerCase() === "pending" && (
                      <>
                        <button
                          onClick={() => handleBookingUpdate(selectedBooking.id, "approved")}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleBookingUpdate(selectedBooking.id, "rejected")}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Toast */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
