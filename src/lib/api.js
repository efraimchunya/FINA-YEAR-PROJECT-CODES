// api.js
import axios from "axios";

// Use environment variable or fallback to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies for authentication if needed
});

// Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = error.response?.data || {
      message: error.message || "An unknown error occurred",
    };
    return Promise.reject(customError);
  }
);

export default api;
