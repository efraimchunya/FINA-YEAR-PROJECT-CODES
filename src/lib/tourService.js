// tourService.js
import api from "./api";

// Tours
export async function getTours() {
  const response = await api.get("/tours");
  return response.data;
}

export async function addTour(tour) {
  const response = await api.post("/tours", tour);
  return response.data;
}

export async function updateTour(tour) {
  const response = await api.put(`/tours/${tour.id}`, tour);
  return response.data;
}

export async function deleteTour(tourId) {
  const response = await api.delete(`/tours/${tourId}`);
  return response.data;
}

// Bookings
export async function getBookings() {
  const response = await api.get("/bookings");
  return response.data;
}
