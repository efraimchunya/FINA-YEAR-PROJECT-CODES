import React, { useEffect, useState } from "react";
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} from "../api";
import { toast, ToastContainer } from "react-toastify";
import { ZanzibarMap } from "../components/ZanzibarMap";
import Modal from "react-modal";
import Swal from "sweetalert2";
import {
  FaTrash,
  FaEdit,
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaMapMarkedAlt,
  FaBookOpen,
  FaLocationArrow,
  FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// UI Components imports for user management (from your shared code)
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";
import { isUnauthorizedError } from "../lib/authUtils";
import { Search, UserPlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

Modal.setAppElement("#root");

// UserManagement component embedded inside this file
function UserManagement() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (roleFilter) params.append("role", roleFilter);
      const response = await fetch(`/api/users?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  // Update role mutation
  const updateRole = async (userId, role) => {
    try {
      await apiRequest("PUT", `/api/users/${userId}/role`, { role });
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      fetchUsers();
    } catch (error) {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  // Deactivate user mutation
  const deactivateUser = async (userId) => {
    try {
      await apiRequest("PUT", `/api/users/${userId}/deactivate`);
      toast({
        title: "Success",
        description: "User deactivated successfully",
      });
      fetchUsers();
    } catch (error) {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to deactivate user",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "staff":
        return "bg-purple-100 text-purple-800";
      case "student":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeColor = (isActive) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-80 mb-6"></div>
          <div className="bg-white rounded-lg border p-4 mb-6">
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white rounded-lg border">
            <div className="h-64 bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <p className="text-gray-600">Manage user accounts and permissions</p>
      </div>

      {/* Search and Filter Controls */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>

            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Administrators</SelectItem>
                </SelectContent>
              </Select>

              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <img
                          src={
                            user.profileImageUrl ||
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=200"
                          }
                          alt="User avatar"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-900">
                      {user.department || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(user.isActive)}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {user.updatedAt
                        ? formatDistanceToNow(new Date(user.updatedAt), {
                            addSuffix: true,
                          })
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Select
                          value={user.role}
                          onValueChange={(newRole) => updateRole(user.id, newRole)}
                        >
                          <SelectTrigger className="w-24 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>

                        {user.isActive && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deactivateUser(user.id)}
                          >
                            Deactivate
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-gray-500">
                      {search || roleFilter
                        ? "No users found matching your criteria."
                        : "No users found."}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboard() {
  // Location & booking states
  const [locations, setLocations] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Modal & form states for location
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    imageFilen: null,
    imageFilename: "",
  });

  // Theme, sidebar & view
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("map");

  const navigate = useNavigate();

  // Profile data & editing
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@example.com",
    phone: "+255 987 654 321",
    location: "Zanzibar",
    avatarUrl: "https://i.pravatar.cc/100?u=admin",
  });

  const [editProfileMode, setEditProfileMode] = useState(false);
  const [profileEditData, setProfileEditData] = useState(profile);

  // Load data initially
  useEffect(() => {
    refresh();
  }, []);

  // Sync dark mode with document
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
    .then((res) => setLocations(res.data.locations || []))
    .catch(() => toast.error("Failed to load locations"));

  getAllBookings()
    .then((res) => setBookings(res.data))
    .catch(() => toast.error("Failed to load bookings"));
};

const openModal = (location = null) => {
  setCurrentLocation(location);
  setFormData(
    location
      ? {
          name: location.name,
          category: location.category,
          description: location.description,
          imageFilename: extractFilename(location.imageurl),
          imageFile: null, // reset file input
        }
      : {
          name: "",
          category: "",
          description: "",
          imageFilename: "",
          imageFile: null,
        }
  );
  setModalIsOpen(true);
};

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
  
const handleSaveLocation = async () => {
  if (!formData.name.trim()) {
    toast.error("Name is required.");
    return;
  }

  // Optional: Validate image type
  if (formData.imageFile && !formData.imageFile.type.startsWith("image/")) {
    toast.error("Only image files are allowed.");
    return;
  }

  const locationData = new FormData();
  locationData.append("name", formData.name);
  locationData.append("category", formData.category);
  locationData.append("description", formData.description);

  // Handle image upload or fallback to existing filename
  if (formData.imageFile) {
    locationData.append("image", formData.imageFile); // new image
  } else if (formData.imageFilename) {
    locationData.append("imageFilename", formData.imageFilename); // existing image
  }

  // Update existing location
  if (currentLocation?.id) {
    try {
      await updateLocation(currentLocation.id, locationData);
      toast.success("Location updated!");
      closeModal();
      refresh();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update location.");
    }
  } else {
    // Validate coordinates for new location
    if (!currentLocation?.lat || !currentLocation?.lng) {
      toast.error("Invalid location coordinates.");
      return;
    }

    locationData.append("lat", currentLocation.lat);
    locationData.append("lng", currentLocation.lng);
    locationData.append("bookinglink", "");

    try {
      await createLocation(locationData);
      toast.success("Location created!");
      closeModal();
      refresh();
    } catch (error) {
      console.error("Create error:", error);
      toast.error("Failed to create location.");
    }
  }
};

  const handleDeleteLocation = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteLocation(id)
          .then(() => {
            toast.success("Location deleted.");
            refresh();
          })
          .catch(() => toast.error("Failed to delete location."));
      }
    });
  };

  const handleApproveBooking = (id) => {
    updateBookingStatus(id, "Approved")
      .then(() => {
        toast.success("Booking approved!");
        refresh();
      })
      .catch(() => toast.error("Failed to approve booking."));
  };

  const handleRejectBooking = (id) => {
    updateBookingStatus(id, "Rejected")
      .then(() => {
        toast.success("Booking rejected!");
        refresh();
      })
      .catch(() => toast.error("Failed to reject booking."));
  };

  const handleDeleteBooking = (id) => {
    Swal.fire({
      title: "Delete booking?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBooking(id)
          .then(() => {
            toast.success("Booking deleted.");
            refresh();
          })
          .catch(() => toast.error("Failed to delete booking."));
      }
    });
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Handle start editing profile: copy current profile data
  const startEditProfile = () => {
    setProfileEditData(profile);
    setEditProfileMode(true);
  };

  // Handle cancel editing: discard changes
  const cancelEditProfile = () => {
    setEditProfileMode(false);
  };

  // Handle input changes in edit mode
  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Save profile changes (you can replace with API call)
  const saveProfile = () => {
    // You can add validation here if needed
    setProfile(profileEditData);
    setEditProfileMode(false);
    toast.success("Profile updated!");
    // TODO: call your API to update profile on server here
  };

  // Sidebar menu items
  const menuItems = [
    { key: "map", label: "View Map", icon: <FaMapMarkedAlt /> },
    { key: "locations", label: "Manage Locations", icon: <FaLocationArrow /> },
    { key: "bookings", label: "Manage Bookings", icon: <FaBookOpen /> },
    { key: "users", label: "Manage Users", icon: <FaUsers /> },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-md z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        {/* Profile section */}
        <div className="p-6 flex flex-col items-center border-b border-gray-300 dark:border-gray-700">
          <div className="relative">
            <img
              src={profile.avatarUrl}
              alt="Admin Profile"
              className="w-24 h-24 rounded-full border-4 border-blue-600 dark:border-blue-400"
            />
            {/* Edit icon (optional click handler) */}
            <div className="absolute bottom-0 right-0 bg-blue-600 dark:bg-blue-400 rounded-full p-1 border-2 border-white dark:border-gray-800 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>

          {!editProfileMode ? (
            <>
              <p className="mt-4 font-semibold text-center text-lg">{profile.name}</p>
              <p className="text-sm mt-1 text-center text-gray-600 dark:text-gray-400 break-words">
                {profile.email}
              </p>
              <p className="text-sm mt-1 text-center text-gray-600 dark:text-gray-400">
                {profile.phone}
              </p>
              <p className="text-sm mt-1 text-center text-gray-600 dark:text-gray-400">
                {profile.location}
              </p>
              <button
                className="mt-4 px-5 py-2 bg-blue-600 dark:bg-blue-400 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-500 transition"
                onClick={startEditProfile}
              >
                Edit Profile
              </button>
            </>
          ) : (
            <form
              className="mt-4 w-full flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                saveProfile();
              }}
            >
              <input
                type="text"
                name="name"
                value={profileEditData.name}
                onChange={handleProfileInputChange}
                placeholder="Name"
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100"
                required
              />
              <input
                type="email"
                name="email"
                value={profileEditData.email}
                onChange={handleProfileInputChange}
                placeholder="Email"
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100"
                required
              />
              <input
                type="tel"
                name="phone"
                value={profileEditData.phone}
                onChange={handleProfileInputChange}
                placeholder="Phone"
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100"
              />
              <input
                type="text"
                name="location"
                value={profileEditData.location}
                onChange={handleProfileInputChange}
                placeholder="Location"
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100"
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={cancelEditProfile}
                  className="px-4 py-2 rounded border border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar menu */}
        <nav className="flex flex-col p-4 flex-grow overflow-auto">
          {menuItems.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveView(key)}
              className={`flex items-center gap-3 p-3 rounded mb-2 w-full text-left transition-colors ${
                activeView === key
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-100 dark:hover:bg-gray-700"
              }`}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Dark mode toggle */}
        <div className="p-4 border-t border-gray-300 dark:border-gray-700">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-full"
            title="Toggle dark mode"
          >
            {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-300 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded w-full justify-center"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* Sidebar toggle for small screens */}
      <button
        aria-label="Toggle sidebar"
        className="fixed top-4 left-4 z-60 p-2 rounded-md border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Main content */}
      <main
        className={`flex-1 ml-0 md:ml-64 p-6 transition-all duration-300 min-h-screen`}
      >
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Views */}
        {activeView === "map" && (
          <div className="h-[600px] rounded shadow overflow-hidden relative z-0">
            <ZanzibarMap
              locations={locations}
              onMapClick={(latlng) =>
                openModal({ lat: latlng.lat, lng: latlng.lng })
              }
              mode="admin"
            />
          </div>
        )}

        {activeView === "locations" && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Locations</h2>
              <button
                onClick={() => openModal(null)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                + Add Location
              </button>
            </div>
            <ul className="space-y-3 max-h-[600px] overflow-y-auto">
              {locations.map((loc) => (
                <li
                  key={loc.id}
                  className="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded shadow"
                >
                  <div>
                    <strong>{loc.name}</strong>{" "}
                    {loc.category && (
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        ({loc.category})
                      </span>
                    )}
                    <p className="text-sm">{loc.description}</p>
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
                      onClick={() => handleDeleteLocation(loc.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
                      title="Delete Location"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {activeView === "bookings" && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Booking Requests</h2>
            <ul className="space-y-3 max-h-[600px] overflow-y-auto">
              {bookings.map((b) => (
                <li
                  key={b.id}
                  className="p-4 bg-white dark:bg-gray-700 rounded shadow flex justify-between items-center"
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
                          b.status.toLowerCase() === "approved"
                            ? "text-green-600"
                            : b.status.toLowerCase() === "rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {b.status}
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {b.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleApproveBooking(b.id)}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                          title="Approve"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectBooking(b.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                          title="Reject"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteBooking(b.id)}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded"
                      title="Delete"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {activeView === "users" && <UserManagement />}
        

        {/* Location Add/Edit Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Location Modal"
          className={`max-w-lg mx-auto my-20 p-6 rounded shadow-lg outline-none ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]"
        >
          <h2 className="text-xl font-bold mb-4">
            {currentLocation ? "Edit Location" : "Add Location"}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveLocation();
            }}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-2 border rounded bg-transparent border-gray-300 dark:border-gray-600"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full p-2 border rounded bg-transparent border-gray-300 dark:border-gray-600"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full p-2 border rounded bg-transparent border-gray-300 dark:border-gray-600"
            />
            <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imageFilename: file.name,
      }));
    }
  }}
  className="w-full p-2 border rounded bg-transparent border-gray-300 dark:border-gray-600"
/>

{formData.imageFile && (
  <div className="mt-2">
    <p className="text-sm text-gray-500 dark:text-gray-400">Preview:</p>
    <img
      src={URL.createObjectURL(formData.imageFile)}
      alt="Preview"
      className="w-full max-h-64 object-contain rounded border border-gray-300 dark:border-gray-600"
    />
  </div>
)}


            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded border border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      </main>
      
    </div>
  );
}
