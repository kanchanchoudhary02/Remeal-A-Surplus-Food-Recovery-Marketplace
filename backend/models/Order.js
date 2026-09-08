// models/Order.js

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        foodListingId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FoodListing",
          required: true,
        },
        providerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        title: String,          // snapshot — agar listing baad me delete ho jaye, order me naam rahega
        quantity: Number,
        price: Number,          // per-unit price, order time pe jo tha
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    platformFee: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryPartnerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},
    status: {
      type: String,
      enum: ["PLACED", "CONFIRMED", "READY_FOR_PICKUP", "PICKED_UP", "ON_THE_WAY", "DELIVERED", "REJECTED"],
      default: "PLACED",
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FREE"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;