import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Saree from "../../../models/Saree";
import { media } from "../../data/media";
import { requireAdmin } from "../../../lib/auth";

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

function parseBoolean(value) {
  return value === true || value === "true" || value === "on";
}

export async function POST(request) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ message: "Admin sign-in required." }, { status: 401 });
  }

  await connectDB();
  const formData = await request.formData();
  const saree = await Saree.create({
    category: formData.get("category"),
    type: formData.get("type"),
    name: formData.get("name"),
    code: formData.get("code"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock") || 1),
    imageUrl: formData.get("imageUrl") || media.bannerPerson,
    palluImageUrl: formData.get("palluImageUrl") || "",
    borderImageUrl: formData.get("borderImageUrl") || "",
    bodyImageUrl: formData.get("bodyImageUrl") || "",
    description: formData.get("description") || "",
    fabric: formData.get("fabric") || "",
    style: formData.get("style") || "",
    zariType: formData.get("zariType") || "",
    occasion: formData.get("occasion") || "",
    length: formData.get("length") || "6.3 meters with blouse",
    blouseStatus: formData.get("blouseStatus") || "Unstitched",
    vendorId: formData.get("vendorId") || "",
    vendorName: formData.get("vendorName") || "",
    fallPico: parseBoolean(formData.get("fallPico")),
    customBlouseStitching: parseBoolean(formData.get("customBlouseStitching")),
    material: parseList(formData.get("material")),
    design: parseList(formData.get("design")),
    border: parseList(formData.get("border")),
    blouse: parseList(formData.get("blouse")),
    zariColour: parseList(formData.get("zariColour")),
    weave: parseList(formData.get("weave")),
    palluColour: parseList(formData.get("palluColour")),
    availability: formData.get("availability") || "available"
  });
  return NextResponse.json(saree, { status: 201 });
}

export async function PUT(request) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ message: "Admin sign-in required." }, { status: 401 });
  }

  await connectDB();
  const formData = await request.formData();
  const id = formData.get("id") || formData.get("_id");
  const code = formData.get("code");
  const update = {
    category: formData.get("category"),
    type: formData.get("type"),
    name: formData.get("name"),
    code,
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock") || 1),
    imageUrl: formData.get("imageUrl") || media.bannerPerson,
    palluImageUrl: formData.get("palluImageUrl") || "",
    borderImageUrl: formData.get("borderImageUrl") || "",
    bodyImageUrl: formData.get("bodyImageUrl") || "",
    description: formData.get("description") || "",
    fabric: formData.get("fabric") || "",
    style: formData.get("style") || "",
    zariType: formData.get("zariType") || "",
    occasion: formData.get("occasion") || "",
    length: formData.get("length") || "6.3 meters with blouse",
    blouseStatus: formData.get("blouseStatus") || "Unstitched",
    vendorId: formData.get("vendorId") || "",
    vendorName: formData.get("vendorName") || "",
    fallPico: parseBoolean(formData.get("fallPico")),
    customBlouseStitching: parseBoolean(formData.get("customBlouseStitching")),
    material: parseList(formData.get("material")),
    design: parseList(formData.get("design")),
    border: parseList(formData.get("border")),
    blouse: parseList(formData.get("blouse")),
    zariColour: parseList(formData.get("zariColour")),
    weave: parseList(formData.get("weave")),
    palluColour: parseList(formData.get("palluColour")),
    availability: formData.get("availability") || "available"
  };

  const query = id && /^[a-f\d]{24}$/i.test(String(id))
    ? { _id: id }
    : { code };

  const saree = await Saree.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true
  });

  if (!saree) {
    return NextResponse.json({ message: "Saree not found" }, { status: 404 });
  }

  return NextResponse.json(saree);
}
