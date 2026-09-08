// controllers/uploadController.js

import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// Helper function — buffer ko Cloudinary tak "stream" ke through pahunchata hai
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "remeal/food-listings" }, // Cloudinary me isi folder ke andar save hoga
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// @route   POST /api/upload
// @access  Private (logged-in users)
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    const result = await streamUpload(req.file.buffer);

    res.status(200).json({
      success: true,
      imageUrl: result.secure_url, // ye URL hi MongoDB me save karenge
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { uploadImage };