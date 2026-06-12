import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  points: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
