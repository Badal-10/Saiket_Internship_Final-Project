// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // change if needed
  timeout: 10000,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If backend returns 401, clear storage and force a reload to Home
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default api;
