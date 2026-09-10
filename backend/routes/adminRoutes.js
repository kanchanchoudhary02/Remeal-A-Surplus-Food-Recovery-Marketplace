// routes/adminRoutes.js

import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  getAllProviders,
  verifyProvider,
  toggleBlockUser,
  getAllOrders,
  getAllListings,
  removeListing,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ Sabhi routes pe protect + authorize("admin") — har request pe double security
router.get("/stats", protect, authorize("admin"), getDashboardStats);
router.get("/users", protect, authorize("admin"), getAllUsers);
router.get("/providers", protect, authorize("admin"), getAllProviders);
router.put("/providers/:id/verify", protect, authorize("admin"), verifyProvider);
router.put("/users/:id/block", protect, authorize("admin"), toggleBlockUser);
router.get("/orders", protect, authorize("admin"), getAllOrders);
router.get("/listings", protect, authorize("admin"), getAllListings);
router.delete("/listings/:id", protect, authorize("admin"), removeListing);

export default router;