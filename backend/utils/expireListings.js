// utils/expireListings.js
// Chhota helper — jab bhi call ho, saari expired listings ko EXPIRED mark kar deta hai

import FoodListing from "../models/FoodListing.js";

const expireOldListings = async () => {
  try {
    await FoodListing.updateMany(
      {
        status: "ACTIVE",
        availableUntil: { $lt: new Date() }, // jinka availableUntil abhi se pehle ka hai
      },
      { status: "EXPIRED" }
    );
  } catch (error) {
    console.error("Failed to expire old listings:", error.message);
  }
};

export default expireOldListings;