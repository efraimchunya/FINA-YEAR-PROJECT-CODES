import axios from "axios";

// Base API setup
const API = axios.create({ baseURL: "http://localhost:5000/api" });

/* 🗺️ LOCATIONS */
export const getLocations = () => API.get("/locations");
export const createLocation = (data) => API.post("/locations", data);
export const updateLocation = (id, data) => API.put(`/locations/${id}`, data);
export const deleteLocation = (id) => API.delete(`/locations/${id}`);

/* 🧭 ACTIVITIES */
export const getActivities = (locationId) => API.get(`/activities/${locationId}`);
export const createActivity = (data) => API.post("/activities", data);

/* 📅 BOOKINGS */
export const getAllBookings = () => API.get("/bookings");
export const createBooking = (data) => API.post("/bookings", data);
export const updateBooking = (id, data) => API.put(`/bookings/${id}`, data);

// ✅ NEW: Get bookings for a specific user
export const getUserBookings = (userId) => API.get(`/bookings/user/${userId}`);

// ✅ Booking status update (admin/operator)
export const updateBookingStatus = (id, status) =>
  API.put(`/bookings/${id}`, { status });

/* 👥 USERS */
export const getUsers = () => API.get("/users");
export const deleteUser = (id) => API.delete(`/users/${id}`);
