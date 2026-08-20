// middleware/errorMiddleware.js
// Ye Express ka special "error-handling middleware" hai.
// Pehchan: iske function me 4 parameters hote hain (err, req, res, next) — 
// Express automatically samajh jata hai ye error handler hai.

// 1. Agar koi route hi exist nahi karta (galat URL), to ye chalega
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error); // error ko aage errorHandler ko bhej diya
};

// 2. Ye poore app ka CENTRAL error handler hai.
// Kahi bhi controller me error aaye, throw karo — ye yaha aakar pakda jayega.
const errorHandler = (err, req, res, next) => {
  // Agar status code set nahi hua, default 500 (Server Error) rakho
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    // stack trace sirf development me dikhao, production me chhupao (security)
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };