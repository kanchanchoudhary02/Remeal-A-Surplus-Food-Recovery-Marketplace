// src/services/api.js
// Ye ek "axios instance" hai — matlab axios ka ek pre-configured version.
// Poore project me har jagah API call karne ke liye isi "api" ko import karenge,
// baar baar poora URL (http://localhost:5000/api/...) likhne ki zaroorat nahi padegi.

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // .env file se aata hai
  headers: {
    "Content-Type": "application/json",
  },
});

// Day 7 me hum yaha ek "interceptor" add karenge jo
// har request ke saath automatically JWT token bhej dega.

export default api;
