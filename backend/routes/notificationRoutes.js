// routes/notificationRoutes.js

import express from "express";
import { getMyNotifications, markAllAsRead } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyNotifications);
router.put("/mark-read", protect, markAllAsRead);

export default router;