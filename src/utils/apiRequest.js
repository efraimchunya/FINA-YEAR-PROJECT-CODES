import axios from "axios";

const apiRequest = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Automatically attach the token to headers
apiRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiRequest;
