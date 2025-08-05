import React, { useEffect, useState, useRef } from "react";
import { ZanzibarMap } from "../components/ZanzibarMap";
import {
  getLocations,
  getActivities,
  createBooking,
  getAllBookings,
} from "../api";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import { Menu, X, Sun, Moon, LogOut, Save, Download } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

Modal.setAppElement("#root");

export default function TouristDashboard() {
  // === States ===
  const [locations, setLocations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [selectedActivityName, setSelectedActivityName] = useState("");
  const [formData, setFormData] = useState({ full_name: "", notes: "" });
  const [showMap, setShowMap] = useState(true);
  const [theme, setTheme] = useState("light");
  const [viewBooking, setViewBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  const fileInputRef = useRef(null);

 const bookingInputRef = useRef(null);
 const closeButtonRef = useRef(null);

  // Load user profile from localStorage or default
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("touristUser");
    return savedUser
      ? JSON.parse(savedUser)
      : {
          id: 1,
          name: "Tourist User",
          email: "tourist@example.com",
          phone: "+255 123 456 789",
          location: "Zanzibar",
          image: "https://i.pravatar.cc/100?u=tourist",
        };
  });
  const [profileImage, setProfileImage] = useState(user.image);

  // Effects
useEffect(() => {
  if (selectedActivityId && bookingInputRef.current) {
    bookingInputRef.current.focus();
  }
}, [selectedActivityId]);

// Focus close button when View Booking Modal opens
useEffect(() => {
  if (viewBooking && closeButtonRef.current) {
    closeButtonRef.current.focus();
  }
}, [viewBooking]);

  useEffect(() => {
    loadLocations();
    loadBookings();
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  useEffect(() => {
    applyFilter();
  }, [bookings, filterStatus]);

  useEffect(() => {
    localStorage.setItem("touristUser", JSON.stringify(user));
  }, [user]);

  // API Calls

async function loadLocations() {
  try {
    const res = await getLocations();
    // Adjust if your backend returns { success: true, locations: [...] }
    const locationsArray = res.data.locations || res.data; 

    if (!Array.isArray(locationsArray)) {
      throw new Error("Locations data is not an array");
    }

    setLocations(locationsArray);
    setActivities([]); // clear previous activities

    // Fetch all activities in parallel for all locations
    const activitiesArrays = await Promise.all(
      locationsArray.map((loc) => fetchActivities(loc.id))
    );

    // Flatten the activities arrays into one array
    const allActivities = activitiesArrays.flat();

    setActivities(allActivities);
  } catch (err) {
    console.error(err);
    toast.error("Failed to load locations");
  }
}

  async function loadBookings() {
    try {
      const res = await getAllBookings();
      const myBookings = res.data.filter((b) => b.user_id === user.id);
      setBookings(myBookings);
    } catch {
      toast.error("Failed to load bookings");
    }
  }

async function fetchActivities(locationId) {
  try {
    const res = await getActivities(locationId);
    const activities = res.data.activities || res.data || []; // safest
    return activities;
  } catch (err) {
    toast.error("Failed to load activities");
    return [];
  }
}


  // Filter bookings by status
  function applyFilter() {
    if (filterStatus === "All") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(
        bookings.filter(
          (b) => b.status.toLowerCase() === filterStatus.toLowerCase()
        )
      );
    }
  }

  // Booking handlers
  function handleBookActivity(locationId, activityId) {
    setSelectedLocationId(locationId);
    setSelectedActivityId(activityId);
    const activity = activities.find((a) => a.id === activityId);
    setSelectedActivityName(activity?.name || "");
    setFormData({ full_name: "", notes: "" });
    setMenuOpen(false);
  }

  async function handleBookSubmit() {
    if (!formData.full_name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    try {
      await createBooking({
        location_id: selectedLocationId,
        activity_id: selectedActivityId,
        user_id: user.id,
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
  }

  // Theme toggle
  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    setTheme(newTheme);
  }

  // Logout
  function handleLogout() {
    localStorage.removeItem("touristUser");
    toast.info("Logging out...");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  }

  // Profile image upload
  function handleProfileImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setUser((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }

  // Profile input changes
  function handleProfileChange(field, value) {
    setUser((prev) => ({ ...prev, [field]: value }));
  }

  // Save profile edits
  function handleSaveProfile() {
    if (!user.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    if (!user.email.trim()) {
      toast.error("Email cannot be empty");
      return;
    }
    setEditingProfile(false);
    toast.success("Profile updated!");
  }

  // PDF Download handler - with table using jspdf-autotable
  async function downloadBookingsPdf() {
    if (!filteredBookings.length) {
      toast.info("No bookings to export.");
      return;
    }
    const doc = new jsPDF();

    // Load logo image from public folder
    const img = new Image();
    img.src = "/icons/img/zanzibar-logo.png";

    img.onload = () => {
      doc.addImage(img, "PNG", 10, 10, 30, 30);
      doc.setFontSize(22);
      doc.text("My Bookings", 50, 25);

      // Prepare columns and rows
      const columns = [
        { header: "Activity", dataKey: "activity_name" },
        { header: "Location", dataKey: "location_name" },
        { header: "Status", dataKey: "status" },
        { header: "Full Name", dataKey: "full_name" },
        { header: "Notes", dataKey: "notes" },
      ];

      const rows = filteredBookings.map((b) => ({
        activity_name: b.activity_name,
        location_name: b.location_name,
        status: b.status,
        full_name: b.full_name,
        notes: b.notes || "None",
      }));

      autoTable(doc, {
        startY: 45,
        columns,
        body: rows,
        theme: "grid",
        headStyles: { fillColor: [0, 123, 255] },
      });

      doc.save("My_Bookings.pdf");
    };

    img.onerror = () => {
      toast.error("Failed to load logo image for PDF");
    };
  }

  return (
    <div
      className={`min-h-screen flex ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      } transition-colors duration-300`}
    >
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 shadow-md z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 ${
          theme === "dark"
            ? "bg-gray-800 border-r border-gray-700"
            : "bg-white border-r border-gray-300"
        }`}
      >
        {/* Profile header */}
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h11M9 21V3m7 18h4a2 2 0 002-2v-4"
                />
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

          {!editingProfile ? (
            <>
              <div className="text-center text-sm font-semibold truncate w-full">
                {user.name}
              </div>
              <div className="text-xs truncate w-full" title={user.email}>
                {user.email}
              </div>
              <div className="text-xs truncate w-full">{user.phone}</div>
              <div className="text-xs truncate w-full">
                {user.location || "No location"}
              </div>

              <button
                className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
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
                value={user.location || ""}
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

        {/* Navigation buttons */}
        <nav className="flex flex-col p-4 gap-3">
          <button
            className={`px-4 py-2 rounded font-medium text-left transition-colors duration-200 ${
              showMap
                ? "bg-green-600 text-white"
                : theme === "dark"
                ? "hover:bg-gray-700"
                : "hover:bg-gray-200"
            }`}
            onClick={() => {
              setShowMap(true);
              setMenuOpen(false);
            }}
          >
            View Map
          </button>

          <button
            className={`px-4 py-2 rounded font-medium text-left transition-colors duration-200 ${
              !showMap
                ? "bg-green-600 text-white"
                : theme === "dark"
                ? "hover:bg-gray-700"
                : "hover:bg-gray-200"
            }`}
            onClick={() => {
              setShowMap(false);
              setMenuOpen(false);
            }}
          >
            My Bookings
          </button>

          <button
            onClick={() => {
              toggleTheme();
              setMenuOpen(false);
            }}
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

      {/* Main Content */}
      <main
        className={`flex-1 w-full p-6 ml-0 md:ml-64 transition-all duration-300 ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <ToastContainer position="top-right" autoClose={3000}/>

        <h1 className="text-2xl font-bold mb-4">Tourist Dashboard</h1>

        {/* Booking Filter Dropdown - only when booking list is visible */}
        {!showMap && (
          <div className="mb-4 flex items-center gap-3">
            <label
              htmlFor="filterStatus"
              className={`font-semibold ${
                theme === "dark" ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Filter bookings:
            </label>
            <select
              id="filterStatus"
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

            {/* PDF Download Button */}
            <button
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 ml-auto"
              onClick={downloadBookingsPdf}
              title="Download bookings as PDF"
            >
              <Download size={16} />
              Download PDF
            </button>
          </div>
        )}

        {/* Map or Bookings List */}
        {showMap ? (
          <div
            className="rounded-md overflow-hidden"
            style={{ height: "calc(100vh - 170px)" }}
          >
            <ZanzibarMap
              locations={locations}
              activities={activities}
              onBookActivity={handleBookActivity}
              mode="tourist"
            />
          </div>
        ) : (
          <div
            className={`overflow-x-auto rounded-md border ${
              theme === "dark" ? "border-gray-700" : "border-gray-300"
            }`}
            style={{ maxHeight: "calc(100vh - 170px)" }}
          >
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr
                  className={`${
                    theme === "dark"
                      ? "bg-gray-700 text-gray-100"
                      : "bg-gray-200 text-gray-900"
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
                      <td className="border px-4 py-2 border-gray-400">
                        {b.activity_name}
                      </td>
                      <td className="border px-4 py-2 border-gray-400">
                        {b.location_name}
                      </td>
                      <td
                        className={`border px-4 py-2 border-gray-400 font-semibold ${
                          b.status.toLowerCase() === "approved"
                            ? "text-green-600"
                            : b.status.toLowerCase() === "rejected"
                            ? "text-red-600"
                            : ""
                        }`}
                      >
                        {b.status}
                      </td>
                      <td className="border px-4 py-2 border-gray-400">
                        <button
                          className={`px-2 py-1 rounded ${
                            theme === "dark"
                              ? "bg-gray-700 hover:bg-gray-600 text-white"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                          onClick={() => setViewBooking(b)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Booking Modal */}
<Modal
  isOpen={!!selectedActivityId}
  onRequestClose={() => setSelectedActivityId(null)}
  contentLabel="Book Activity"
  className={`max-w-lg mx-auto mt-20 p-6 rounded-md outline-none ${
    theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
  }`}
  overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[9999]"
>
  <h2 className="text-xl font-bold mb-4">Book: {selectedActivityName}</h2>
  <form
    onSubmit={(e) => {
      e.preventDefault();
      handleBookSubmit();
    }}
    className="space-y-4"
  >
    <div>
      <label className="block mb-1 font-semibold" htmlFor="fullName">
        Full Name
      </label>
      <input
        id="fullName"
        type="text"
        className="w-full rounded border px-3 py-2 text-black"
        value={formData.full_name}
        onChange={(e) =>
          setFormData((fd) => ({ ...fd, full_name: e.target.value }))
        }
        required
      />
    </div>

    <div>
      <label className="block mb-1 font-semibold" htmlFor="notes">
        Notes
      </label>
      <textarea
        id="notes"
        rows={3}
        className="w-full rounded border px-3 py-2 text-black"
        value={formData.notes}
        onChange={(e) =>
          setFormData((fd) => ({ ...fd, notes: e.target.value }))
        }
        placeholder="Any additional information"
      />
    </div>

    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={() => setSelectedActivityId(null)}
        className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-200 transition"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
      >
        Book
      </button>
    </div>
  </form>
</Modal>


        {/* View Booking Modal */}
        <Modal
          isOpen={!!viewBooking}
          onRequestClose={() => setViewBooking(null)}
          contentLabel="Booking Details"
          className={`max-w-md mx-auto mt-20 p-6 rounded-md outline-none ${
            theme === "dark"
              ? "bg-gray-800 text-gray-100"
              : "bg-white text-gray-900"
          }`}
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[9999]"
        >
          {viewBooking && (
            <>
              <h2 className="text-xl font-bold mb-4">Booking Details</h2>
              <ul className="space-y-2">
                <li>
                  <strong>Activity:</strong> {viewBooking.activity_name}
                </li>
                <li>
                  <strong>Location:</strong> {viewBooking.location_name}
                </li>
                <li>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      viewBooking.status.toLowerCase() === "approved"
                        ? "text-green-600"
                        : viewBooking.status.toLowerCase() === "rejected"
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {viewBooking.status}
                  </span>
                </li>
                <li>
                  <strong>Full Name:</strong> {viewBooking.full_name}
                </li>
                <li>
                  <strong>Notes:</strong> {viewBooking.notes || "None"}
                </li>
              </ul>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setViewBooking(null)}
                  className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </Modal>

        {/* Hamburger menu for mobile */}
        <button
          className="fixed top-4 left-4 z-60 md:hidden p-2 rounded bg-green-600 text-white focus:outline-none"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </main>
    </div>
  );
}
