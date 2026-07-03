const express = require("express");
const crypto = require("crypto");
const Order = require("../models/Order");

const router = express.Router();

function priceNumber(value) {
  return Number(String(value || "").replace(/[^\d.]/g, "")) || 0;
}

// POST /api/payments/razorpay-order — create a Razorpay order
router.post("/razorpay-order", async (req, res, next) => {
  try {
    const { amount, currency = "INR", receipt, notes = {} } = req.body;
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      res.status(500).json({ error: "Razorpay is not configured on the server." });
      return;
    }

    const amountInRupees = Number(amount);
    if (!amountInRupees || amountInRupees <= 0) {
      res.status(400).json({ error: "A valid order amount is required." });
      return;
    }

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: Math.round(amountInRupees * 100),
        currency,
        receipt: receipt || `sahanvi_${Date.now()}`,
        notes,
        payment_capture: 1
      })
    });

    const order = await response.json();
    if (!response.ok) {
      res.status(response.status).json({
        error: order?.error?.description || "Unable to create Razorpay order."
      });
      return;
    }

    res.json({ keyId, order });
  } catch (error) {
    next(error);
  }
});

// POST /api/payments/verify — verify Razorpay signature and save order to DB
router.post("/verify", async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      delivery = {},
      items = []
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({ error: "Missing payment details." });
      return;
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      res.status(500).json({ error: "Razorpay is not configured on the server." });
      return;
    }

    // Verify HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const providedBuffer = Buffer.from(razorpay_signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    const isValid =
      providedBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(providedBuffer, expectedBuffer);

    if (!isValid) {
      res.status(400).json({ error: "Payment signature could not be verified." });
      return;
    }

    const subtotal = items.reduce((sum, item) => sum + priceNumber(item.price), 0);
    const gst = Math.round(subtotal * 0.05);
    const total = subtotal + gst;

    const order = await Order.create({
      customerName: delivery.name,
      customerEmail: delivery.email,
      customerPhone: delivery.phone,
      address: delivery.address,
      items,
      subtotal,
      gst,
      total,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature
    });

    res.json({ order });
  } catch (error) {
    next(error);
  }
});

// GET /api/payments/orders — fetch orders by email or phone
router.get("/orders", async (req, res, next) => {
  try {
    const { email, phone } = req.query;
    if (!email && !phone) {
      res.status(400).json({ error: "email or phone query param required." });
      return;
    }
    const filter = email
      ? { customerEmail: String(email).toLowerCase() }
      : { customerPhone: String(phone) };

    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
