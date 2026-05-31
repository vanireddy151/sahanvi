import "dotenv/config";
import mongoose from "mongoose";

const sareeSchema = new mongoose.Schema(
  {
    category: String,
    type: String,
    name: String,
    code: String,
    price: Number,
    imageUrl: String,
    description: String,
    isNewArrival: Boolean
  },
  { timestamps: true }
);

const Saree = mongoose.models.Saree || mongoose.model("Saree", sareeSchema);

const sarees = [
  {
    category: "Heritage Sarees",
    type: "Kanjivaram Silks",
    name: "Cream Kanjivaram Silk Saree",
    code: "S763878",
    price: 21020,
    imageUrl: "/assets/sahanvi-banner-person.jpeg",
    description: "Classic Kanjivaram silk saree with graceful handloom appeal.",
    isNewArrival: true
  },
  {
    category: "Heritage Sarees",
    type: "Gadwal Pattu",
    name: "Silver Gadwal Pattu Saree",
    code: "S842176",
    price: 18950,
    imageUrl: "/assets/sahanvi-banner-person-2.jpeg",
    description: "Elegant Gadwal Pattu saree with refined festive drape.",
    isNewArrival: true
  },
  {
    category: "Signature Sarees",
    type: "Organza",
    name: "Royal Organza Silk Saree",
    code: "S684302",
    price: 14520,
    imageUrl: "/assets/sahanvi-banner-person-2.jpeg",
    description: "Lightweight organza saree with modern occasion styling.",
    isNewArrival: true
  },
  {
    category: "Sarees",
    type: "Linen Silk",
    name: "Pink Linen Silk Saree",
    code: "S529410",
    price: 16780,
    imageUrl: "/assets/sahanvi-banner-person.jpeg",
    description: "Soft linen silk saree with an easy, elegant fall.",
    isNewArrival: true
  }
];

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing in .env.local");
}

await mongoose.connect(uri);

for (const saree of sarees) {
  await Saree.findOneAndUpdate({ code: saree.code }, saree, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  });
  console.log(`Seeded ${saree.code}`);
}

await mongoose.disconnect();
console.log("Saree seed complete.");
