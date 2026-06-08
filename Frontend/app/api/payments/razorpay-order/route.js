import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { amount, currency = "INR", receipt, notes = {} } = await request.json();
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay is not configured. Add Razorpay keys in environment variables." },
        { status: 500 }
      );
    }

    const amountInRupees = Number(amount);
    if (!amountInRupees || amountInRupees <= 0) {
      return NextResponse.json({ error: "A valid order amount is required." }, { status: 400 });
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
      return NextResponse.json(
        { error: order?.error?.description || "Unable to create Razorpay order." },
        { status: response.status }
      );
    }

    return NextResponse.json({ keyId, order });
  } catch (error) {
    return NextResponse.json({ error: "Unable to start payment." }, { status: 500 });
  }
}
