// routes/testRoutes.js

import express from "express";
import { getTestMessage, triggerTestError } from "../controllers/testController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getTestMessage);
router.get("/error", triggerTestError);

// ✅ NAYA — koi bhi logged-in user (kisi bhi role ka) access kar sakta hai
router.get("/protected", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: `Hello ${req.user.name}, you are authenticated!`,
    user: req.user,
  });
});

// ✅ NAYA — sirf "provider" role wale access kar sakte hain
router.get("/provider-only", protect, authorize("provider"), (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome Provider ${req.user.name}, you have provider access.`,
  });
});

// ✅ NAYA — sirf "admin" role wale access kar sakte hain
router.get("/admin-only", protect, authorize("admin"), (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome Admin ${req.user.name}.`,
  });
});

export default router;