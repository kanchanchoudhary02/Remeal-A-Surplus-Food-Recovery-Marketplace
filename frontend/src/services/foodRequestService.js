// services/foodRequestService.js

import api from "./api";

export const createFoodRequest = async (requestData) => {
  const response = await api.post("/food-requests", requestData);
  return response.data;
};

export const getFoodRequests = async () => {
  const response = await api.get("/food-requests");
  return response.data;
};

export const getMyFoodRequests = async () => {
  const response = await api.get("/food-requests/my-requests");
  return response.data;
};

export const fulfillFoodRequest = async (id) => {
  const response = await api.put(`/food-requests/${id}/fulfill`);
  return response.data;
};