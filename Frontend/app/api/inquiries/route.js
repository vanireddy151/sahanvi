import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Inquiry from "../../../models/Inquiry";

export async function GET() {
  await connectDB();
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  return NextResponse.json(inquiries);
}

export async function POST(request) {
  await connectDB();
  const body = await request.json();
  const inquiry = await Inquiry.create(body);
  return NextResponse.json(inquiry, { status: 201 });
}
