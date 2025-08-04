import mongoose from "mongoose";
import dotenv from "dotenv";
import InventoryItem from "../models/InventoryItem.js";

dotenv.config();

const inventoryData = [
  { category: "base", name: "Thin Crust", price: 150, qty: 150 },
  { category: "base", name: "Cheese Burst", price: 150, qty: 150 },
  { category: "base", name: "Pan Crust", price: 100, qty: 150 },
  { category: "base", name: "Whole Wheat Base", price: 200, qty: 100 },
  { category: "base", name: "Gluten-free Base", price: 200, qty: 50 },

  { category: "sauce", name: "Tomato Basil", price: 30, qty: 200 },
  { category: "sauce", name: "Pesto Sauce", price: 30, qty: 200 },
  { category: "sauce", name: "Alfredo White Sauce", price: 30, qty: 200 },

  { category: "cheese", name: "Mozzarella", price: 50, qty: 200 },
  { category: "cheese", name: "Cheddar", price: 50, qty: 200 },
  { category: "cheese", name: "Parmesan", price: 50, qty: 200 },
  { category: "cheese", name: "Feta", price: 50, qty: 200 },

  { category: "veggie", name: "Black Olives", price: 20, qty: 300 },
  { category: "veggie", name: "Mushrooms", price: 60, qty: 150 },
  { category: "veggie", name: "Onions", price: 20, qty: 150 },
  { category: "veggie", name: "Capsicum", price: 20, qty: 150 },
  { category: "veggie", name: "Jalapenos", price: 60, qty: 150 },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    await InventoryItem.deleteMany();
    await InventoryItem.insertMany(inventoryData);
    console.log("Inventory seeded successfully!");
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
