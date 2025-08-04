import express from "express";
import Order from "../models/Order.js";
import InventoryItem from "../models/InventoryItem.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import nodemailer from "nodemailer";

const router = express.Router();

// -----------------------------
// Create a new order
// -----------------------------
router.post("/", protect, async (req, res) => {
  try {
    const { items, totalPrice } = req.body;

    console.log("📦 Incoming Order:", req.body);
    console.log("🔹 Authenticated User:", req.user);

    // ✅ 1. Validate user
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // ✅ 2. Validate order items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    // ✅ 3. Check stock before placing the order
    for (const item of items) {
      const inventoryItem = await InventoryItem.findOne({ name: item.name });

      if (!inventoryItem) {
        return res.status(404).json({ message: `${item.name} not found in inventory` });
      }

      if (inventoryItem.qty <= 0) {
        return res.status(400).json({ message: `${item.name} is out of stock!` });
      }
    }

    // ✅ 4. Deduct inventory & check for low stock
    for (const item of items) {
      const inventoryItem = await InventoryItem.findOne({ name: item.name });

      if (inventoryItem) {
        inventoryItem.qty = Math.max(inventoryItem.qty - 1, 0);
        await inventoryItem.save();

        // 🔹 Send low-stock email if qty < 20
        if (inventoryItem.qty < 20) {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
          });

          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "deepusteam1011@gmail.com", // Replace with your admin email
            subject: `Low Stock Alert: ${inventoryItem.name}`,
            text: `Stock for ${inventoryItem.name} is low: only ${inventoryItem.qty} left.`,
          });

          console.log(`⚠️ Low stock email sent for ${inventoryItem.name}`);
        }
      }
    }

    // ✅ 5. Create the order
    const newOrder = new Order({
      user: req.user._id,
      items,
      totalPrice,
      status: "Processing",
    });

    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    console.error("❌ Order creation error:", err);
    res.status(500).json({ message: "Error placing order", error: err.message });
  }
});

// -----------------------------
// Get user's orders
// -----------------------------
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
});

// -----------------------------
// Admin: Get all orders
// -----------------------------
router.get("/admin/orders", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching admin orders", error: err.message });
  }
});

// -----------------------------
// Admin: Update order status
// -----------------------------
router.put("/admin/update-status/:id", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Error updating order status", error: err.message });
  }
});

export default router;
