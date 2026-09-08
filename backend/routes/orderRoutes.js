// routes/orderRoutes.js

import express from "express";
import {
  createOrder,
  getMyOrders,
  getProviderOrders,
  updateOrderStatus,
  getAvailableDeliveries,
  acceptDelivery,
  getMyDeliveries,
  updateDeliveryStatus,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/provider-orders", protect, authorize("provider"), getProviderOrders);
router.put("/:id/status", protect, authorize("provider"), updateOrderStatus);

// ✅ NAYA
router.get("/available-deliveries", protect, authorize("delivery"), getAvailableDeliveries);
router.get("/my-deliveries", protect, authorize("delivery"), getMyDeliveries);
router.put("/:id/accept-delivery", protect, authorize("delivery"), acceptDelivery);
router.put("/:id/delivery-status", protect, authorize("delivery"), updateDeliveryStatus);
export default router;