// middleware/authMiddleware.js
// Ye middleware check karta hai: "request bhejne wala login hai aur uska token valid hai?"

import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  // Frontend token isi format me bhejega: "Authorization: Bearer eyJhbGciOi..."
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // "Bearer eyJhbGci..." me se sirf token wala part nikalo
      token = req.headers.authorization.split(" ")[1];

      // Token ko verify karo — agar tampered/expired hai to ye line error throw karegi
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // decoded.id wahi user ID hai jo humne generateToken.js me daala tha
      // Password chhod ke baaki sab fields fetch karo (.select("-password"))
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ success: false, message: "User no longer exists" });
      }

      // ✅ NAYA — agar user block ho gaya hai, use aage badhne hi na do
      if (req.user.isBlocked) {
        return res.status(403).json({
          success: false,
          message: "Your account has been blocked. Contact support.",
        });
      }

      next(); // sab sahi hai, agle middleware/controller ko jaane do
    } catch (error) {
      return res.status(401).json({ success: false, message: "Not authorized, token invalid" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token provided" });
  }
};

export { protect };