// routes/complaintRoutes.js

import express from "express";
import {
  createComplaint,
  getAllComplaints,
  resolveComplaint,
} from "../controllers/complaintController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, createComplaint);
router.get("/", protect, authorize("admin"), getAllComplaints);
router.put("/:id/resolve", protect, authorize("admin"), resolveComplaint);

export default router;