import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Example API calls
export const loginUser = (data) => api.post('/auth/login', data);
export const fetchSites = () => api.get('/sites'); // Assume your backend has /sites route for tourist points
export const fetchCategories = () => api.get('/categories'); // If you have this endpoint
export const addSite = (data) => api.post('/sites', data);
export const updateSite = (id, data) => api.put(`/sites/${id}`, data);
export const deleteSite = (id) => api.delete(`/sites/${id}`);
