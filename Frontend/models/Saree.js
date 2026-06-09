import mongoose from "mongoose";

const sareeSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Heritage Sarees", "Signature Sarees", "Sarees", "Sahanvi Vintage"],
      required: true
    },
    type: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 1, min: 0 },
    imageUrl: { type: String, required: true },
    palluImageUrl: { type: String, trim: true, default: "" },
    borderImageUrl: { type: String, trim: true, default: "" },
    bodyImageUrl: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    fabric: { type: String, trim: true, default: "" },
    style: { type: String, trim: true, default: "" },
    zariType: { type: String, trim: true, default: "" },
    occasion: { type: String, trim: true, default: "" },
    length: { type: String, trim: true, default: "6.3 meters with blouse" },
    blouseStatus: {
      type: String,
      enum: ["Unstitched", "Stitched", "No Blouse"],
      default: "Unstitched"
    },
    vendorId: { type: String, trim: true, default: "" },
    vendorName: { type: String, trim: true, default: "" },
    fallPico: { type: Boolean, default: false },
    customBlouseStitching: { type: Boolean, default: false },
    material: { type: [String], default: [] },
    design: { type: [String], default: [] },
    border: { type: [String], default: [] },
    blouse: { type: [String], default: [] },
    zariColour: { type: [String], default: [] },
    weave: { type: [String], default: [] },
    palluColour: { type: [String], default: [] },
    availability: {
      type: String,
      enum: ["available", "sold", "hidden"],
      default: "available"
    },
    isNewArrival: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.Saree || mongoose.model("Saree", sareeSchema);
