// services/api.js

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ NAYA — "Interceptor": har request bhejne se PEHLE ye function chalta hai.
// Isse hume har API call me manually token lagane ki zaroorat nahi —
// ye automatically localStorage se token uthake header me daal dega.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;