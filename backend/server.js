// server.js
import authRoutes from "./routes/authRoutes.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import testRoutes from "./routes/testRoutes.js";                    // ✅ NAYA
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"; // ✅ NAYA

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

// ✅ NAYA — ye HAMESHA sabse last me aane chahiye (order important hai!)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});