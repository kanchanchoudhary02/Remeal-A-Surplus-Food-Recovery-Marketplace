// routes/foodRequestRoutes.js

import express from "express";
import {
  createFoodRequest,
  getFoodRequests,
  getMyFoodRequests,
  fulfillFoodRequest,
} from "../controllers/foodRequestController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createFoodRequest);
router.get("/", getFoodRequests);
router.get("/my-requests", protect, getMyFoodRequests);
router.put("/:id/fulfill", protect, fulfillFoodRequest);

export default router;