import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  method: { type: String, enum: ['cash', 'qris', 'card', 'transfer'], required: true },
  amount: Number,
}, { _id: false });

const TransactionItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  qty: Number,
  price: Number,
  discount: Number,
}, { _id: false });

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  items: [TransactionItemSchema],
  subtotal: Number,
  discountTotal: Number,
  taxPercent: Number,
  taxAmount: Number,
  total: Number,
  payments: [PaymentSchema],
  isRefund: { type: Boolean, default: false },
  refundReason: String,
  status: { type: String, default: 'completed' },
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
