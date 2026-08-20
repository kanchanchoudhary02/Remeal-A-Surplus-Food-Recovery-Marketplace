// middleware/roleMiddleware.js
// Ye middleware check karta hai: "login to hai, lekin iska role is action ke liye allowed hai?"

// Ye ek "middleware factory" hai — function jo function return karta hai
// Isse hum roles ko flexible tarike se pass kar sakte hain: authorize("admin"), authorize("provider", "admin")
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user pehle se set hona chahiye — matlab "protect" middleware isse pehle chal chuka ho
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This action requires role: ${allowedRoles.join(" or ")}`,
      });
    }
    next();
  };
};

export { authorize };