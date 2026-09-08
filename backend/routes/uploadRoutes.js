// routes/uploadRoutes.js

import express from "express";
import { uploadImage } from "../controllers/uploadController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// "image" wahi field name hai jo frontend FormData me use karega
router.post("/", protect, upload.single("image"), uploadImage);

export default router;