import mongoose from 'mongoose';

const StockAdjustmentSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  previousStock: Number,
  newStock: Number,
  reason: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.StockAdjustment || mongoose.model('StockAdjustment', StockAdjustmentSchema);
