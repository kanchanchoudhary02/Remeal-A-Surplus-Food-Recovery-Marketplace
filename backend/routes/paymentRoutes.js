// routes/paymentRoutes.js

import express from "express";
import { createCashfreeOrder, verifyPayment } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", protect, createCashfreeOrder);
router.get("/verify/:orderId", protect, verifyPayment);

export default router;