// server.js
import authRoutes from "./routes/authRoutes.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import testRoutes from "./routes/testRoutes.js";                    // ✅ NAYA
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"; // ✅ NAYA
import foodRoutes from "./routes/foodRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import foodRequestRoutes from "./routes/foodRequestRoutes.js";
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ReMeal API is running... 🍽️");
});

// ✅ NAYA — test route ko app se jodo
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes); 
app.use("/api/foods", foodRoutes); 
app.use("/api/upload", uploadRoutes); 
app.use("/api/orders", orderRoutes); // ✅ NAYA — order routes ko app se jodo
app.use("/api/food-requests", foodRequestRoutes);   // ✅ NAYA

// ✅ NAYA — ye HAMESHA sabse last me aane chahiye (order important hai!)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});