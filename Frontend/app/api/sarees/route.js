import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Saree from "../../../models/Saree";

export async function GET() {
  await connectDB();
  const sarees = await Saree.find().sort({ createdAt: -1 });
  return NextResponse.json(sarees);
}

export async function POST(request) {
  await connectDB();
  const formData = await request.formData();
  const image = formData.get("image");
  const saree = await Saree.create({
    category: formData.get("category"),
    type: formData.get("type"),
    name: formData.get("name"),
    code: formData.get("code"),
    price: Number(formData.get("price")),
    imageUrl: image?.name ? `/uploads/${image.name}` : "/assets/sahanvi-banner-person.jpeg",
    description: formData.get("description") || ""
  });
  return NextResponse.json(saree, { status: 201 });
}
