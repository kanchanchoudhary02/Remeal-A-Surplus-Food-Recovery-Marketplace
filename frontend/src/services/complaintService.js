// services/complaintService.js

import api from "./api";

export const createComplaint = async (orderId, reason, description) => {
  const response = await api.post("/complaints", { orderId, reason, description });
  return response.data;
};

export const getAllComplaints = async () => {
  const response = await api.get("/complaints");
  return response.data;
};

export const resolveComplaint = async (id, status, adminNote) => {
  const response = await api.put(`/complaints/${id}/resolve`, { status, adminNote });
  return response.data;
};