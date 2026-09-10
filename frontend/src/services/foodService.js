// services/foodService.js
// Ye file food-related sabhi API calls ek jagah rakhti hai —
// components me seedha "api.post(...)" likhne ki jagah, hum yaha se
// clean function names import karenge (jaise "createFood()")

import api from "./api";

// Naya food listing banao
export const createFood = async (foodData) => {
  const response = await api.post("/foods", foodData);
  return response.data;
};

// Sabhi active listings lao (Day 12 marketplace me use hoga)
// ✅ NAYA — ab optional filters object accept karta hai
export const getFoods = async (filters = {}) => {
  // Axios ka "params" option automatically query string bana deta hai
  // jaise { search: "paneer", foodType: "vegetarian" } →  ?search=paneer&foodType=vegetarian
  const response = await api.get("/foods", { params: filters });
  return response.data;
};

// Ek specific listing ki detail lao (Day 14 me use hoga)
export const getFoodById = async (id) => {
  const response = await api.get(`/foods/${id}`);
  return response.data;
};
export const getProviderReviews = async (providerId) => {
  const response = await api.get(`/foods/provider/${providerId}/reviews`);
  return response.data;
}