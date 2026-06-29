import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    name: String,
    code: String,
    price: String,
    image: String
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, trim: true, lowercase: true },
    customerPhone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    items: { type: [orderItemSchema], default: [] },
    subtotal: { type: Number, required: true, min: 0 },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String, required: true },
    razorpaySignature: { type: String, required: true },
    paymentStatus: { type: String, enum: ["paid"], default: "paid" },
    status: { type: String, default: "Order placed" }
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
