const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    address: { type: String, required: true },
    items: [{ name: String, code: String, price: String, image: String }],
    subtotal: { type: Number, required: true },
    gst: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, required: true },
    razorpaySignature: { type: String, required: true },
    paymentStatus: { type: String, enum: ["paid"], default: "paid" },
    status: { type: String, default: "Order placed" },
    dispatchStatus: { type: String, enum: ["pending", "dispatched"], default: "pending" },
    courierName: { type: String, default: "" },
    trackingNumber: { type: String, default: "" },
    dispatchedAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
