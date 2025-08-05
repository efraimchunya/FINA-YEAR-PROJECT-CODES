import React, { useEffect, useState, useRef } from "react";
import { ZanzibarMap } from "../components/ZanzibarMap";
import {
  getLocations,
  createActivity,
  getAllBookings,
  updateBooking,
  deleteBooking, // added deleteBooking import
} from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Moon, Sun, LogOut, Menu, X, Save } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } from "docx";
import { saveAs } from "file-saver";


export default function OperatorDashboard() {
  // States
  const [locations, setLocations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [newActivity, setNewActivity] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [bookingFilter, setBookingFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("map");
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showBookingDetailsModal, setShowBookingDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  const fileInputRef = useRef(null);

  // Load user from localStorage or default
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("operatorUser");
    return savedUser
      ? JSON.parse(savedUser)
      : {
          id: 1,
          name: "Operator User",
          email: "operator@example.com",
          phone: "+255 987 654 321",
          location: "Zanzibar",
          image: "https://i.pravatar.cc/100?u=operator",
        };
  });
  const [profileImage, setProfileImage] = useState(user.image);

  // Effects
  useEffect(() => {
    refresh();
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Save user to localStorage when user state changes
  useEffect(() => {
    localStorage.setItem("operatorUser", JSON.stringify(user));
  }, [user]);

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
    setMenuOpen(false);
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

  // New: Delete booking handler
  const handleDeleteBooking = (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      deleteBooking(id)
        .then(() => {
          toast.success("Booking deleted");
          refresh();
          setShowBookingDetailsModal(false);
        })
        .catch(() => toast.error("Failed to delete booking"));
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === "all") return true;
    return b.status.toLowerCase() === bookingFilter;
  });

  const handleLogout = () => {
    localStorage.removeItem("operatorUser");
    toast.info("Logging out...");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

  const openBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowBookingDetailsModal(true);
    setMenuOpen(false);
  };

  // Profile image upload
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setUser((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile form input change
  const handleProfileChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  // Save profile edits
  const handleSaveProfile = () => {
    setEditingProfile(false);
    toast.success("Profile updated!");
    // Here you could also sync with backend API if available
  };

const downloadBookingsAsPDF = () => {
  const doc = new jsPDF();

  // Load image from public path
  const img = new Image();
  img.src = "/icons/img/zanzibar-logo.png"; // This path is relative to public folder

  img.onload = () => {
    // Draw image (adjust size and position as needed)
    doc.addImage(img, "PNG", 14, 10, 40, 20);

    // Title text (shifted right to avoid overlap with logo)
    doc.setFontSize(18);
    doc.text("Bookings Report", 60, 25);

    // Prepare table data
    const tableData = bookings.map((b) => [
      b.full_name,
      b.email,
      b.phone,
      b.activity_name,
      b.location_name,
      b.status,
      new Date(b.date).toLocaleString(),
    ]);

    // Draw table below title and logo
    autoTable(doc, {
      startY: 40,
      head: [["Name", "Email", "Phone", "Activity", "Location", "Status", "Date"]],
      body: tableData,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [21, 101, 192] }, // nice blue header color
    });

    doc.save("bookings.pdf");
  };

  img.onerror = () => {
    // If image loading fails, just generate PDF without logo
    doc.setFontSize(18);
    doc.text("Bookings Report", 14, 25);

    const tableData = bookings.map((b) => [
      b.full_name,
      b.email,
      b.phone,
      b.activity_name,
      b.location_name,
      b.status,
      new Date(b.date).toLocaleString(),
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["Name", "Email", "Phone", "Activity", "Location", "Status", "Date"]],
      body: tableData,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [21, 101, 192] },
    });

    doc.save("bookings.pdf");
  };
};

const downloadBookingsAsWord = () => {
  if (!bookings.length) {
    toast.error("No bookings to export");
    return;
  }

  const doc = new Document({
    sections: [
      {
        children: bookings.map(
          (b) =>
            new Paragraph({
              children: [
                new TextRun({ text: `Tourist: ${b.full_name}`, bold: true }),
                new TextRun(`\nEmail: ${b.email}`),
                new TextRun(`\nPhone: ${b.phone}`),
                new TextRun(`\nActivity: ${b.activity_name}`),
                new TextRun(`\nLocation: ${b.location_name}`),
                new TextRun(`\nStatus: ${b.status}`),
                new TextRun(`\nDate: ${new Date(b.date).toLocaleString()}`),
                new TextRun("\n--------------------------\n"),
              ],
            })
        ),
      },
    ],
  });

  Packer.toBlob(doc)
    .then((blob) => {
      // Manually create a download link without using File constructor
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "bookings.docx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    })
    .catch(() => toast.error("Failed to generate Word document"));
}; 

  return (
    <div
      className={`flex h-screen overflow-hidden ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 shadow-md z-50 transform transition-transform duration-300
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${darkMode ? "bg-gray-800 border-r border-gray-700" : "bg-white border-r border-gray-300"}
        `}
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-2 p-4 border-b border-gray-600">
          <div
            className="relative cursor-pointer"
            onClick={() => fileInputRef.current.click()}
            title="Click to change profile photo"
          >
            <img
              src={profileImage}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-green-600"
            />
            <div className="absolute bottom-0 right-0 bg-green-600 rounded-full p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h11M9 21V3m7 18h4a2 2 0 002-2v-4" />
              </svg>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleProfileImageChange}
            />
          </div>

          {/* Editable Profile Info */}
          {!editingProfile ? (
            <>
              <div className="text-center text-sm font-semibold truncate w-full">{user.name}</div>
              <div className="text-xs truncate w-full" title={user.email}>
                {user.email}
              </div>
              <div className="text-xs truncate w-full">{user.phone}</div>
              <div className="text-xs truncate w-full">{user.location || "No location"}</div>

              <button
                className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={() => setEditingProfile(true)}
              >
                Edit Profile
              </button>
            </>
          ) : (
            <div className="w-full space-y-2">
              <input
                type="text"
                className="w-full p-1 rounded border border-gray-400 text-black"
                value={user.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
                placeholder="Name"
              />
              <input
                type="email"
                className="w-full p-1 rounded border border-gray-400 text-black"
                value={user.email}
                onChange={(e) => handleProfileChange("email", e.target.value)}
                placeholder="Email"
              />
              <input
                type="text"
                className="w-full p-1 rounded border border-gray-400 text-black"
                value={user.phone}
                onChange={(e) => handleProfileChange("phone", e.target.value)}
                placeholder="Phone"
              />
              <input
                type="text"
                className="w-full p-1 rounded border border-gray-400 text-black"
                value={user.location}
                onChange={(e) => handleProfileChange("location", e.target.value)}
                placeholder="Location"
              />
              <div className="flex justify-between mt-1">
                <button
                  onClick={() => setEditingProfile(false)}
                  className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-1 px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                >
                  <Save size={16} />
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col p-4 gap-3">
          <button
            onClick={() => {
              setActiveTab("map");
              setMenuOpen(false);
            }}
            className={`px-4 py-2 rounded font-medium text-left transition-colors duration-200 ${
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
            onClick={() => {
              setActiveTab("bookings");
              setMenuOpen(false);
            }}
            className={`px-4 py-2 rounded font-medium text-left transition-colors duration-200 ${
              activeTab === "bookings"
                ? "bg-blue-600 text-white"
                : darkMode
                ? "hover:bg-gray-700"
                : "hover:bg-blue-100"
            }`}
          >
            Manage Bookings
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark/light mode"
            className={`flex items-center gap-2 px-4 py-2 border rounded font-medium transition-colors duration-200 ${
              darkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            Toggle Theme
          </button>
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 border rounded text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </aside>

      {/* Hamburger menu toggle button for mobile */}
      <button
        aria-label="Toggle menu"
        className={`fixed top-4 left-4 z-60 p-2 rounded-md border md:hidden ${
          darkMode
            ? "border-gray-600 bg-gray-800 text-gray-100 hover:bg-gray-700"
            : "border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
        } transition-colors duration-200`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Main Content */}
      <main
        className={`flex-1 p-6 ml-0 md:ml-64 transition-all duration-300 overflow-auto ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

        {activeTab === "map" && (
          <>
            <div className="relative z-10" style={{ height: "500px" }}>
              <ZanzibarMap locations={locations} onAddActivity={handleOpenAddActivity} mode="operator" />
            </div>

            {showAddActivityModal && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                <div
                  className={`rounded-lg w-full max-w-md p-6 shadow-lg ${
                    darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                  }`}
                >
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

            <div className="mb-4 flex gap-2">
  <button
    onClick={downloadBookingsAsPDF}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
  >
    Download PDF
  </button>
  <button
    onClick={downloadBookingsAsWord}
    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
  >
    Download Word
  </button>
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
                      <div className="flex gap-2">
                        {b.status.toLowerCase() === "pending" && (
                          <>
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
                          </>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBooking(b.id);
                          }}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {b.notes && <p className="text-xs italic mt-1">Notes: {b.notes}</p>}
                    <div className="text-xs mt-1">
                      Status: <span className="capitalize">{b.status}</span> |{" "}
                      {new Date(b.date).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* Booking Details Modal */}
        {showBookingDetailsModal && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div
              className={`max-w-lg w-full rounded-lg p-6 shadow-lg ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
            >
              <h3 className="text-xl font-semibold mb-4">Booking Details</h3>
              <p>
                <strong>Name: </strong>
                {selectedBooking.full_name}
              </p>
              <p>
                <strong>Email: </strong>
                {selectedBooking.email}
              </p>
              <p>
                <strong>Phone: </strong>
                {selectedBooking.phone}
              </p>
              <p>
                <strong>Activity: </strong>
                {selectedBooking.activity_name}
              </p>
              <p>
                <strong>Location: </strong>
                {selectedBooking.location_name}
              </p>
              <p>
                <strong>Status: </strong>
                <span className="capitalize">{selectedBooking.status}</span>
              </p>
              {selectedBooking.notes && (
                <p>
                  <strong>Notes: </strong>
                  {selectedBooking.notes}
                </p>
              )}
              <p>
                <strong>Date: </strong>
                {new Date(selectedBooking.date).toLocaleString()}
              </p>

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
                <button
                  onClick={() => handleDeleteBooking(selectedBooking.id)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
                >
                  Delete Booking
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? "dark" : "light"}
        />
      </main>
    </div>
  );
}
