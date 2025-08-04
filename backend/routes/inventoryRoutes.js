import express from "express";
import InventoryItem from "../models/InventoryItem.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin: Get all inventory items
router.get("/admin/inventory", protect, adminOnly, async (req, res) => {
  const items = await InventoryItem.find();
  res.json(items);
});

// Admin: Update inventory item qty
router.put("/admin/inventory/:id", protect, adminOnly, async (req, res) => {
  const { qty } = req.body;
  const item = await InventoryItem.findById(req.params.id);

  if (!item) return res.status(404).json({ message: "Item not found" });

  item.qty = qty;
  await item.save();

  res.json({ message: "Inventory updated", item });
});

export default router;
