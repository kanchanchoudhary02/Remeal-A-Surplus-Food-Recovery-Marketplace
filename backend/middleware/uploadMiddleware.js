// middleware/uploadMiddleware.js
// Multer ko batata hai: file ko disk pe save mat karo, memory me hi rakho
// (kyunki humein use turant Cloudinary ko forward karna hai, permanently backend pe nahi rakhna)

import multer from "multer";

const storage = multer.memoryStorage();

// Sirf image files allow karo, aur size limit lagao (5 MB)
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

export default upload;