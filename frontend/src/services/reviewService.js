// services/reviewService.js

import api from "./api";

export const createReview = async (orderId, rating, comment) => {
  const response = await api.post("/reviews", { orderId, rating, comment });
  return response.data;
};

export const getProviderReviews = async (providerId) => {
  const response = await api.get(`/reviews/${providerId}`);
  return response.data;
};