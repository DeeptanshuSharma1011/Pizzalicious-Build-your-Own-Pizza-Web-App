import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        category: { type: String, required: true }, // base, sauce, cheese, veggie
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "Processing" }, // Processing | Out for Delivery | Delivered
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
