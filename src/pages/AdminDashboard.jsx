import React, { useEffect, useState } from "react";
import {
  getLocations,
  getAllBookings,
  updateBookingStatus,
  createLocation,
  deleteLocation,
  updateLocation,
} from "../api";
import { toast, ToastContainer } from "react-toastify";
import { ZanzibarMap } from "../components/ZanzibarMap";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { FaTrash, FaEdit, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

export default function AdminDashboard() {
  const [locations, setLocations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    imageFilename: "", // Changed to filename for public/icons/img/
  });

  // Dark mode toggle state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const navigate = useNavigate();

  useEffect(() => {
    refresh();
  }, []);

  // Apply dark mode class to <html> and save to localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const refresh = () => {
    getLocations()
      .then((res) => setLocations(res.data))
      .catch(() => toast.error("Failed to load locations"));

    getAllBookings()
      .then((res) => setBookings(res.data))
      .catch(() => toast.error("Failed to load bookings"));
  };

  const handleApprove = (bookingId) => {
    updateBookingStatus(bookingId, "approved")
      .then(() => {
        toast.success("Booking approved!");
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, status: "approved" } : b
          )
        );
      })
      .catch(() => toast.error("Failed to approve booking"));
  };

  const handleReject = (bookingId) => {
    updateBookingStatus(bookingId, "rejected")
      .then(() => {
        toast.success("Booking rejected!");
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, status: "rejected" } : b
          )
        );
      })
      .catch(() => toast.error("Failed to reject booking"));
  };

  const openModal = (location = null) => {
    setCurrentLocation(location);
    setFormData(
      location
        ? {
            name: location.name,
            category: location.category,
            description: location.description,
            imageFilename: extractFilename(location.imageurl), // convert url to filename
          }
        : { name: "", category: "", description: "", imageFilename: "" }
    );
    setModalIsOpen(true);
  };

  // Extract filename from full image URL for editing
  function extractFilename(url) {
    if (!url) return "";
    try {
      const parts = url.split("/");
      return parts[parts.length - 1];
    } catch {
      return "";
    }
  }

  const closeModal = () => setModalIsOpen(false);

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    // Build full image URL from filename in /icons/img/
    const fullImageUrl = formData.imageFilename
      ? `/icons/img/${formData.imageFilename}`
      : "";

    if (currentLocation && currentLocation.id) {
      updateLocation(currentLocation.id, {
        ...currentLocation,
        ...formData,
        imageurl: fullImageUrl,
      })
        .then(() => {
          toast.success("Location updated!");
          closeModal();
          refresh();
        })
        .catch(() => toast.error("Failed to update."));
    } else {
      // For new location, lat/lng must exist in currentLocation
      if (!currentLocation || !currentLocation.lat || !currentLocation.lng) {
        toast.error("Invalid location coordinates.");
        return;
      }
      createLocation({
        ...formData,
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        imageurl: fullImageUrl,
        bookinglink: "",
      })
        .then(() => {
          toast.success("Location created!");
          closeModal();
          refresh();
        })
        .catch(() => toast.error("Failed to create."));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Booking Info Modal state and handlers
  const [bookingInfoModalOpen, setBookingInfoModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const openBookingInfoModal = (booking) => {
    setSelectedBooking(booking);
    setBookingInfoModalOpen(true);
  };

  const closeBookingInfoModal = () => {
    setSelectedBooking(null);
    setBookingInfoModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4">
      {/* Header with dark mode toggle & logout */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <div className="flex gap-4 items-center">
          {/* Dark/Light Mode Toggle Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle dark mode"
            className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <FaSun className="text-yellow-400" size={20} />
            ) : (
              <FaMoon className="text-gray-800" size={20} />
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
            title="Logout"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      {/* Map and Locations */}
      <ZanzibarMap
        locations={locations}
        onMapClick={(latlng) => openModal({ lat: latlng.lat, lng: latlng.lng })}
        mode="admin"
      />

      <ul className="space-y-2 my-6">
        {locations.map((loc) => (
          <li
            key={loc.id}
            className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded shadow"
          >
            <div>
              <strong>{loc.name}</strong>
              {loc.category && (
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({loc.category})
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openModal(loc)}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                title="Edit Location"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => {
                  Swal.fire({
                    title: "Are you sure?",
                    text: "This cannot be undone.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, delete it!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      deleteLocation(loc.id)
                        .then(() => {
                          toast.success("Location deleted.");
                          refresh();
                        })
                        .catch(() => toast.error("Failed to delete."));
                    }
                  });
                }}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
                title="Delete Location"
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Booking Requests */}
      <h3 className="text-xl font-semibold mb-3">Booking Requests</h3>
      <ul className="space-y-3">
        {bookings.map((b) => (
          <li
            key={b.id}
            className="p-4 bg-white dark:bg-gray-800 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{b.full_name || b.username}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Activity: {b.activity_name} @ {b.location_name}
              </p>
              {b.notes && (
                <p className="text-xs italic text-gray-400 dark:text-gray-500 mb-1">
                  “{b.notes}”
                </p>
              )}
              <p className="text-xs">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    b.status === "approved"
                      ? "text-green-600 dark:text-green-400"
                      : b.status === "rejected"
                      ? "text-red-600 dark:text-red-400"
                      : "text-yellow-600 dark:text-yellow-400"
                  }`}
                >
                  {b.status}
                </span>
              </p>
            </div>

            <div className="flex gap-2">
              {b.status !== "approved" && b.status !== "rejected" && (
                <>
                  <button
                    onClick={() => handleApprove(b.id)}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                    title="Approve booking"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(b.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    title="Reject booking"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => openBookingInfoModal(b)}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                title="View booking details"
              >
                View Info
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for Create/Edit Location */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Location Modal"
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1000 },
          content: {
            maxWidth: "500px",
            margin: "auto",
            padding: "20px",
            borderRadius: "10px",
            position: "relative",
            zIndex: 1001,
          },
        }}
      >
        <h3 className="text-lg font-semibold mb-4">
          {currentLocation?.id ? "Edit Location" : "Add Location"}
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Image Filename (in /icons/img/)"
            value={formData.imageFilename}
            onChange={(e) =>
              setFormData({ ...formData, imageFilename: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={closeModal} className="px-3 py-1 border rounded">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Booking Info Modal */}
      <Modal
        isOpen={bookingInfoModalOpen}
        onRequestClose={closeBookingInfoModal}
        contentLabel="Booking Info Modal"
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1000 },
          content: {
            maxWidth: "400px",
            margin: "auto",
            padding: "20px",
            borderRadius: "10px",
            position: "relative",
            zIndex: 1001,
          },
        }}
      >
        {selectedBooking && (
          <>
            <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
            <p>
              <strong>Full Name:</strong> {selectedBooking.full_name}
            </p>
            <p>
              <strong>Activity:</strong> {selectedBooking.activity_name}
            </p>
            <p>
              <strong>Location:</strong> {selectedBooking.location_name}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="capitalize">{selectedBooking.status}</span>
            </p>
            {selectedBooking.notes && (
              <p>
                <strong>Notes:</strong> {selectedBooking.notes}
              </p>
            )}
            <p>
              <strong>Booking Date:</strong>{" "}
              {new Date(selectedBooking.date).toLocaleString()}
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeBookingInfoModal}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Close
              </button>
            </div>
          </>
        )}
      </Modal>

      <ToastContainer />
    </div>
  );
}