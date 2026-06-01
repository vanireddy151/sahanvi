import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Saree from "../../../models/Saree";
import { media } from "../../data/media";

export async function GET() {
  await connectDB();
  const sarees = await Saree.find().sort({ createdAt: -1 });
  return NextResponse.json(sarees);
}

export async function POST(request) {
  await connectDB();
  const formData = await request.formData();
  const saree = await Saree.create({
    category: formData.get("category"),
    type: formData.get("type"),
    name: formData.get("name"),
    code: formData.get("code"),
    price: Number(formData.get("price")),
    imageUrl: formData.get("imageUrl") || media.bannerPerson,
    description: formData.get("description") || ""
  });
  return NextResponse.json(saree, { status: 201 });
}
