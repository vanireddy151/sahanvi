import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Order from "../../../models/Order";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");
  const email = searchParams.get("email");

  if (!phone && !email) {
    return NextResponse.json({ error: "phone or email query param is required." }, { status: 400 });
  }

  await connectDB();
  const query = phone ? { customerPhone: phone } : { customerEmail: String(email).toLowerCase() };
  const orders = await Order.find(query).sort({ createdAt: -1 });

  return NextResponse.json(orders);
}
