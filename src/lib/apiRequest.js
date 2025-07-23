// src/lib/apiRequest.js
import api from "./api";

// Admin Dashboard
export const getAdminDashboardData = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

// Operator Dashboard
export const getOperatorDashboardData = async () => {
  const response = await api.get("/operator/dashboard");
  return response.data;
};

// Tours
export const getTours = async () => {
  const response = await api.get("/tours");
  return response.data;
};

export const addTour = async (tour) => {
  const response = await api.post("/tours", tour);
  return response.data;
};

export const updateTour = async (tour) => {
  const response = await api.put(`/tours/${tour.id}`, tour);
  return response.data;
};

export const deleteTour = async (tourId) => {
  const response = await api.delete(`/tours/${tourId}`);
  return response.data;
};

// Bookings
export const getBookings = async () => {
  const response = await api.get("/bookings");
  return response.data;
};
