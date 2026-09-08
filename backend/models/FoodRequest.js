// models/FoodRequest.js

import mongoose from "mongoose";

const foodRequestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foodType: {
      type: String,
      enum: ["vegetarian", "non_vegetarian", "vegan", "any"],
      default: "any",
    },
    requiredQuantity: {
      type: Number,
      required: [true, "Required quantity is required"],
      min: 1,
    },
    requiredDate: {
      type: Date,
      required: true,
    },
    requiredTime: {
      type: String, // simple string rakh rahe hain (jaise "8:00 PM") — abhi date+time combine nahi kar rahe, simplicity ke liye
      required: true,
    },
    location: {
      address: { type: String, required: true },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
    },
    budget: {
      type: Number,
      default: 0, // 0 matlab "free chahiye / donation ki ummeed"
    },
    purpose: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["OPEN", "FULFILLED", "CANCELLED"],
      default: "OPEN",
    },
    fulfilledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

foodRequestSchema.index({ "location.coordinates": "2dsphere" });

const FoodRequest = mongoose.model("FoodRequest", foodRequestSchema);

export default FoodRequest;