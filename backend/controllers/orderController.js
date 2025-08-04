import Order from "../models/Order.js";
import InventoryItem from "../models/InventoryItem.js";

export const createOrder = async (req, res) => {
  try {
    console.log("🔹 Authenticated User:", req.user);
    console.log("📦 Incoming Body:", req.body);

    const { items, totalPrice } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    const order = new Order({
      user: req.user._id,
      items,
      totalPrice,
      status: "Processing",
    });

    await order.save();

    // Deduct inventory
    for (let item of items) {
      const itemName = item.name || item; // Support string or object
      console.log("🔹 Deducting inventory for:", itemName);

      const inventoryItem = await InventoryItem.findOne({ name: itemName });
      if (inventoryItem) {
        inventoryItem.qty = Math.max(inventoryItem.qty - 1, 0);
        await inventoryItem.save();
      } else {
        console.warn(`⚠️ Inventory item not found: ${itemName}`);
      }
    }

    res.status(201).json({ message: "Order placed successfully!", order });
  } catch (err) {
    console.error("❌ Order creation error:", err);
    res.status(500).json({ message: "Server error creating order", error: err.message });
  }
};
