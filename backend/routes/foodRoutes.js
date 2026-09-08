// routes/foodRoutes.js

import express from "express";
import {
  createFoodListing,
  getFoodListings,
  getFoodListingById,
} from "../controllers/foodController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public routes — koi bhi dekh sakta hai, login zaroori nahi
router.get("/", getFoodListings);
router.get("/:id", getFoodListingById);

// Protected route — sirf logged-in provider create kar sakta hai
router.post("/", protect, authorize("provider"), createFoodListing);

export default router;