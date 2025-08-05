import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

/* LOCATIONS */
export const getLocations = () => API.get("/locations");
export const createLocation = (data) =>
  API.post("/locations", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateLocation = (id, data) =>
  API.put(`/locations/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteLocation = (id) => API.delete(`/locations/${id}`);

/* ACTIVITIES */
export const getActivities = (locationId) => API.get(`/activities/${locationId}`);
export const createActivity = (data) => API.post("/activities", data);

/* BOOKINGS */
export const getAllBookings = () => API.get("/bookings");
export const createBooking = (data) => API.post("/bookings", data);
export const updateBooking = (id, data) => API.put(`/bookings/${id}`, data);
export const deleteBooking = (id) => API.delete(`/bookings/${id}`);

/* USER BOOKINGS */
export const getUserBookings = (userId) => API.get(`/bookings/user/${userId}`);

/* BOOKING STATUS UPDATE */
export const updateBookingStatus = (id, status) => API.put(`/bookings/${id}`, { status });

/* USERS */
// Added cache busting query param to force fresh fetch every call
export const getUsers = () => API.get(`/users?cacheBust=${Date.now()}`);

export const deleteUser = (id) => API.delete(`/users/${id}`);
