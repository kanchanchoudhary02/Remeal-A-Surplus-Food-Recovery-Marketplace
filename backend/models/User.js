// models/User.js
// Ye "schema" hai — MongoDB collection me document kaisa dikhega, uska blueprint.

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // aage-peeche ka extra space hata deta hai
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // do users same email se register nahi kar sakte
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      // Hashed password store hoga yaha, kabhi plain text nahi
    },
    role: {
      type: String,
      enum: ["provider", "buyer", "delivery", "admin"], // sirf ye 4 values allowed
      default: "buyer",
    },
    // Provider-specific field (Day 8 me fully use hoga)
    providerType: {
      type: String,
      enum: [
        "restaurant",
        "cafe",
        "hotel",
        "caterer",
        "event_organizer",
        "bhandara_organizer",
        "hostel_mess",
        "canteen",
        "other",
      ],
      required: function () {
        return this.role === "provider"; // sirf tab required jab role "provider" ho
      },
    },
    address: {
      type: String,
    },
    verificationStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true, // automatically createdAt aur updatedAt add kar deta hai
  }
);

// "User" model MongoDB me "users" collection banayega (Mongoose automatically plural + lowercase karta hai)
const User = mongoose.model("User", userSchema);

export default User;