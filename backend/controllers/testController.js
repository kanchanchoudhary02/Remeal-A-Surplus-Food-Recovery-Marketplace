// controllers/testController.js
// Controller ka kaam: request aane pe "kya response dena hai" decide karna.

// Ek normal success response
const getTestMessage = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend structure is working correctly ✅",
  });
};

// Ek jaan-boojh kar error throw karne wala route — error handler test karne ke liye
const triggerTestError = (req, res) => {
  // Ye error middleware/errorMiddleware.js ke errorHandler tak jayega
  throw new Error("This is a test error");
};

export { getTestMessage, triggerTestError };