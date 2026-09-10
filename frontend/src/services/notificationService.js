// services/notificationService.js

import api from "./api";

export const getMyNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await api.put("/notifications/mark-read");
  return response.data;
};