import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Order from "../../../../models/Order";

function priceNumber(value) {
  return Number(String(value || "").replace(/[^\d.]/g, "")) || 0;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      delivery = {},
      items = []
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: "Razorpay is not configured." }, { status: 500 });
    }

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
      return NextResponse.json({ error: "Payment signature could not be verified." }, { status: 400 });
    }

    const subtotal = items.reduce((sum, item) => sum + priceNumber(item.price), 0);

    await connectDB();
    const order = await Order.create({
      customerName: delivery.name,
      customerEmail: delivery.email,
      customerPhone: delivery.phone,
      address: delivery.address,
      items,
      subtotal,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature
    });

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: "Unable to verify payment." }, { status: 500 });
  }
}
