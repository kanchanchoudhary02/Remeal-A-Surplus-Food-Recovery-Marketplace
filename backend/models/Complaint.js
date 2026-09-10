// models/Complaint.js

import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    filedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      enum: [
        "FOOD_QUALITY",
        "LATE_DELIVERY",
        "WRONG_ITEM",
        "PROVIDER_BEHAVIOR",
        "DELIVERY_BEHAVIOR",
        "PAYMENT_ISSUE",
        "OTHER",
      ],
      required: true,
    },
    description: {
      type: String,
      required: [true, "Please describe the issue"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["OPEN", "RESOLVED", "DISMISSED"],
      default: "OPEN",
    },
    adminNote: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;