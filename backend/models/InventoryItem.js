import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  category: { type: String, enum: ['base', 'sauce', 'cheese', 'veggie'], required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, default: 0 },
  threshold: { type: Number, default: 10 }
});

export default mongoose.model('InventoryItem', inventorySchema);
