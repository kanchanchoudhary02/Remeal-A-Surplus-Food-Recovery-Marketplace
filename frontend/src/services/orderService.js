// services/orderService.js

import api from "./api";

export const placeOrder = async (items) => {
  // items = [{ foodListingId, quantity }, ...]
  const response = await api.post("/orders", { items });
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get("/orders/my-orders");
  return response.data;
};
// ✅ NAYA
export const getAvailableDeliveries = async () => {
  const response = await api.get("/orders/available-deliveries");
  return response.data;
};

export const acceptDelivery = async (orderId) => {
  const response = await api.put(`/orders/${orderId}/accept-delivery`);
  return response.data;
};

export const getMyDeliveries = async () => {
  const response = await api.get("/orders/my-deliveries");
  return response.data;
};