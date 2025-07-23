import React, { useEffect, useState } from "react";
import { ZanzibarMap } from "../components/ZanzibarMap";
import {
  getLocations,
  getActivities,
  createBooking,
  getAllBookings,
} from "../api";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import { Menu, X, Sun, Moon, LogOut } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

export default function TouristDashboard() {
  const [locations, setLocations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [selectedActivityName, setSelectedActivityName] = useState("");
  const [formData, setFormData] = useState({ full_name: "", notes: "" });
  const [showMap, setShowMap] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [viewBooking, setViewBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    loadLocations();
    loadBookings();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [bookings, filterStatus]);

  const loadLocations = async () => {
    try {
      const res = await getLocations();
      setLocations(res.data);
      res.data.forEach((loc) => fetchActivities(loc.id));
    } catch {
      toast.error("Failed to load locations");
    }
  };

  const loadBookings = async () => {
    try {
      const res = await getAllBookings();
      const myBookings = res.data.filter((b) => b.user_id === 1); // Replace with auth user ID
      setBookings(myBookings);
    } catch {
      toast.error("Failed to load bookings");
    }
  };

  const fetchActivities = async (locationId) => {
    try {
      const res = await getActivities(locationId);
      const withLocation = res.data.map((a) => ({
        ...a,
        location_id: locationId,
      }));
      setActivities((prev) => [...prev, ...withLocation]);
    } catch {
      toast.error("Failed to load activities");
    }
  };

  const applyFilter = () => {
    if (filterStatus === "All") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(
        bookings.filter((b) => b.status.toLowerCase() === filterStatus.toLowerCase())
      );
    }
  };

  const handleBookActivity = (locationId, activityId) => {
    setSelectedLocationId(locationId);
    setSelectedActivityId(activityId);
    const activity = activities.find((a) => a.id === activityId);
    setSelectedActivityName(activity?.name || "");
    setFormData({ full_name: "", notes: "" });
  };

  const handleBookSubmit = async () => {
    if (!formData.full_name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    try {
      await createBooking({
        location_id: selectedLocationId,
        activity_id: selectedActivityId,
        user_id: 1,
        full_name: formData.full_name.trim(),
        notes: formData.notes.trim(),
      });
      toast.success("Booking sent!");
      setSelectedLocationId(null);
      setSelectedActivityId(null);
      setSelectedActivityName("");
      loadBookings();
    } catch {
      toast.error("Booking failed.");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    setTheme(newTheme);
  };

  const handleLogout = () => {
    toast.info("Logging out...");
    setTimeout(() => {
      window.location.href = "/login"; // Adjust this to your route
    }, 1000);
  };

  return (
    <div
      className={`min-h-screen flex ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-900"
      } transition-colors duration-300`}
    >
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 ${
          theme === "dark"
            ? "bg-gray-800 border-r border-gray-700 text-gray-100"
            : "bg-white border-r border-gray-300 text-gray-900"
        } shadow-md z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className={`flex justify-between items-center p-4 border-b ${
            theme === "dark" ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-gray-500 hover:text-gray-300"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col p-4 gap-4">
          <button
            className={`px-4 py-2 rounded text-left font-medium ${
              showMap
                ? "bg-green-600 text-white"
                : theme === "dark"
                ? "hover:bg-gray-700"
                : "hover:bg-gray-200"
            } transition-colors duration-200`}
            onClick={() => setShowMap(true)}
          >
            View Map
          </button>
          <button
            className={`px-4 py-2 rounded text-left font-medium ${
              !showMap
                ? "bg-green-600 text-white"
                : theme === "dark"
                ? "hover:bg-gray-700"
                : "hover:bg-gray-200"
            } transition-colors duration-200`}
            onClick={() => setShowMap(false)}
          >
            My Bookings
          </button>
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-2 px-4 py-2 border rounded font-medium transition-colors duration-200 ${
              theme === "dark"
                ? "border-gray-600 hover:bg-gray-700"
                : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            Toggle Theme
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border rounded text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 ml-0 md:ml-64 transition-all duration-300 w-full p-4 ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <ToastContainer />
        <div
          className={`flex items-center justify-between p-4 mb-4 rounded-md shadow-md ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(true)}
              className={`p-2 rounded-md border ${
                theme === "dark"
                  ? "border-gray-600 hover:bg-gray-700"
                  : "border-gray-300 hover:bg-gray-100"
              } transition-colors duration-200`}
              aria-label="Open Menu"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold">Tourist Dashboard</h1>
          </div>
        </div>

        {/* Content area */}
        {showMap ? (
          <ZanzibarMap
            locations={locations}
            activities={activities}
            onBookActivity={handleBookActivity}
            mode="tourist"
          />
        ) : (
          <div>
            <h2
              className={`text-2xl font-semibold mb-4 flex items-center justify-between ${
                theme === "dark" ? "text-gray-100" : "text-gray-900"
              }`}
            >
              My Bookings
              {/* Booking filter dropdown */}
              <select
                className={`border rounded p-2 text-sm font-medium focus:outline-none transition-colors duration-200 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option>All</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </h2>

            <div
              className={`overflow-x-auto rounded-md border ${
                theme === "dark" ? "border-gray-700" : "border-gray-300"
              }`}
            >
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr
                    className={`${
                      theme === "dark" ? "bg-gray-700 text-gray-100" : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <th className="border px-4 py-2 border-gray-400">Activity</th>
                    <th className="border px-4 py-2 border-gray-400">Location</th>
                    <th className="border px-4 py-2 border-gray-400">Status</th>
                    <th className="border px-4 py-2 border-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className={`text-center py-4 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        No bookings found.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr
                        key={b.id}
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-200" : "text-gray-900"
                        }`}
                      >
                        <td className="border px-4 py-2 border-gray-400">{b.activity_name}</td>
                        <td className="border px-4 py-2 border-gray-400">{b.location_name}</td>
                        <td className="border px-4 py-2 border-gray-400">{b.status}</td>
                        <td className="border px-4 py-2 border-gray-400">
                          <button
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                            onClick={() => setViewBooking(b)}
                          >
                            View Info
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={!!selectedActivityId}
        onRequestClose={() => {
          setSelectedLocationId(null);
          setSelectedActivityId(null);
          setSelectedActivityName("");
        }}
        contentLabel="Book Activity"
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000 },
          content: {
            maxWidth: "400px",
            margin: "auto",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: theme === "dark" ? "#1f2937" : "white",
            color: theme === "dark" ? "white" : "black",
          },
        }}
      >
        <h2 className="text-xl font-semibold mb-4">Book: {selectedActivityName}</h2>
        <input
          type="text"
          placeholder="Your Full Name"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          className={`w-full border p-2 rounded mb-3 ${
            theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
          }`}
        />
        <textarea
          placeholder="Notes (optional)"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className={`w-full border p-2 rounded mb-4 ${
            theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
          }`}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setSelectedLocationId(null);
              setSelectedActivityId(null);
              setSelectedActivityName("");
            }}
            className={`px-4 py-2 border rounded hover:bg-gray-100 ${
              theme === "dark" ? "hover:bg-gray-600 hover:text-white" : ""
            } transition-colors duration-200`}
          >
            Cancel
          </button>
          <button
            onClick={handleBookSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
          >
            Book
          </button>
        </div>
      </Modal>

      {/* Booking Info Modal */}
      <Modal
        isOpen={!!viewBooking}
        onRequestClose={() => setViewBooking(null)}
        contentLabel="Booking Info"
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1000 },
          content: {
            maxWidth: "400px",
            margin: "auto",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: theme === "dark" ? "#1f2937" : "white",
            color: theme === "dark" ? "white" : "black",
          },
        }}
      >
        {viewBooking && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Booking Info</h3>
            <p>
              <strong>Activity:</strong> {viewBooking.activity_name}
            </p>
            <p>
              <strong>Location:</strong> {viewBooking.location_name}
            </p>
            <p>
              <strong>Status:</strong> {viewBooking.status}
            </p>
            <p>
              <strong>Name:</strong> {viewBooking.full_name}
            </p>
            <p>
              <strong>Notes:</strong> {viewBooking.notes || "None"}
            </p>
            <div className="flex justify-end mt-4">
              <button
                className={`px-4 py-2 border rounded hover:bg-gray-100 ${
                  theme === "dark" ? "hover:bg-gray-600 hover:text-white" : ""
                } transition-colors duration-200`}
                onClick={() => setViewBooking(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
