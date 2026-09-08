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