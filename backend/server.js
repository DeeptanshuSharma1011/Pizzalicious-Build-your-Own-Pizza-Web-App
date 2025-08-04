import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { protect, adminOnly } from "./middleware/authMiddleware.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON
app.use("/api/inventory", inventoryRoutes);
app.use("/api/payment", paymentRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

// Example Protected Routes (for testing JWT)
app.get("/api/my-orders", protect, (req, res) => {
  res.json({ message: `Orders for ${req.user.email}` });
});

app.get("/api/admin/inventory", protect, adminOnly, (req, res) => {
  res.json({ message: "Admin Inventory Access Granted" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
