import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Saree from "../../../models/Saree";
import { media } from "../../data/media";

export async function GET() {
  await connectDB();
  const sarees = await Saree.find().sort({ createdAt: -1 });
  return NextResponse.json(sarees);
}

function parseList(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch {
    return String(value)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
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
    description: formData.get("description") || "",
    material: parseList(formData.get("material")),
    design: parseList(formData.get("design")),
    border: parseList(formData.get("border")),
    blouse: parseList(formData.get("blouse")),
    zariColour: parseList(formData.get("zariColour")),
    weave: parseList(formData.get("weave")),
    palluColour: parseList(formData.get("palluColour"))
  });
  return NextResponse.json(saree, { status: 201 });
}
