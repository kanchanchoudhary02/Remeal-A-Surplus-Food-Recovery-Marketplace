// models/FoodListing.js
// Ye ReMeal ka sabse important model hai — surplus food listing ka blueprint

import mongoose from "mongoose";

const foodListingSchema = new mongoose.Schema(
  {
    // ---- WHO ----
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ---- BASIC INFO ----
    title: {
      type: String,
      required: [true, "Food title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    foodType: {
      type: String,
      enum: ["vegetarian", "non_vegetarian", "vegan"],
      required: true,
    },
    listingType: {
      type: String,
      enum: ["SURPLUS", "END_OF_DAY_SURPLUS"],
      required: true,
    },

    // ---- QUANTITY & PRICE ----
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: 1,
    },
    servings: {
      type: Number,
      required: [true, "Number of servings is required"],
      min: 1,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // ---- AVAILABILITY (TIME) ----
    availableFrom: {
      type: Date,
      required: true,
    },
    availableUntil: {
      type: Date,
      required: true,
    },
    consumeBefore: {
      type: Date,
      required: true,
    },

    // ---- FOOD SAFETY DETAILS ----
    preparationTime: {
      type: Date,
    },
    storageType: {
      type: String,
      trim: true,
    },
    safetyDeclaration: {
      type: Boolean,
      required: [true, "Provider must confirm the food safety declaration"],
      validate: {
        validator: (value) => value === true,
        message: "You must confirm the food is safe for redistribution",
      },
    },

    // ---- LOCATION ----
    pickupLocation: {
      address: { type: String, required: true },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
    },

    // ---- IMAGES ----
    images: {
      type: [String],
      default: [],
    },

    // ---- STATUS ----
    status: {
      type: String,
      enum: ["ACTIVE", "SOLD_OUT", "EXPIRED", "PAUSED", "CANCELLED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

foodListingSchema.index({ "pickupLocation.coordinates": "2dsphere" });

const FoodListing = mongoose.model("FoodListing", foodListingSchema);

export default FoodListing;