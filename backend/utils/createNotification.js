// utils/createNotification.js
// Ye chhota helper function hai — poore app me kahi bhi notification banani ho,
// isko import karke ek line me call kar sakte hain

import Notification from "../models/Notification.js";

const createNotification = async (recipientId, message, type, relatedOrderId = null) => {
  try {
    await Notification.create({ recipientId, message, type, relatedOrderId });
  } catch (error) {
    // Notification fail hone se poora order/action fail nahi hona chahiye,
    // isliye sirf console pe log karte hain, error throw nahi karte
    console.error("Failed to create notification:", error.message);
  }
};

export default createNotification;