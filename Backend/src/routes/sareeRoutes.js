const path = require("path");
const express = require("express");
const multer = require("multer");
const Saree = require("../models/Saree");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-z0-9.]/gi, "-").toLowerCase();
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed."));
      return;
    }

    cb(null, true);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const sarees = await Saree.find().sort({ createdAt: -1 });
    res.json(sarees);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAdmin, upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file && !req.body.imageUrl) {
      res.status(400).json({ message: "Saree image is required." });
      return;
    }

    const saree = await Saree.create({
      category: req.body.category,
      type: req.body.type,
      name: req.body.name,
      code: req.body.code,
      price: Number(req.body.price),
      stock: Number(req.body.stock || 1),
      imageUrl: req.body.imageUrl || `/uploads/${req.file.filename}`,
      description: req.body.description,
      palluImageUrl: req.body.palluImageUrl || "",
      borderImageUrl: req.body.borderImageUrl || "",
      bodyImageUrl: req.body.bodyImageUrl || "",
      fabric: req.body.fabric || "",
      style: req.body.style || "",
      zariType: req.body.zariType || "",
      occasion: req.body.occasion || "",
      length: req.body.length || "6.3 meters with blouse",
      blouseStatus: req.body.blouseStatus || "Unstitched",
      vendorId: req.body.vendorId || "",
      vendorName: req.body.vendorName || "",
      fallPico: parseBoolean(req.body.fallPico),
      customBlouseStitching: parseBoolean(req.body.customBlouseStitching),
      material: parseList(req.body.material),
      design: parseList(req.body.design),
      border: parseList(req.body.border),
      blouse: parseList(req.body.blouse),
      zariColour: parseList(req.body.zariColour),
      weave: parseList(req.body.weave),
      palluColour: parseList(req.body.palluColour),
      isNewArrival: req.body.isNewArrival !== "false",
      availability: req.body.availability || "available"
    });

    res.status(201).json(saree);
  } catch (error) {
    next(error);
  }
});

router.put("/", requireAdmin, upload.single("image"), async (req, res, next) => {
  try {
    const id = req.body.id || req.body._id;
    const code = req.body.code;
    const update = {
      category: req.body.category,
      type: req.body.type,
      name: req.body.name,
      code,
      price: Number(req.body.price),
      stock: Number(req.body.stock || 1),
      imageUrl: req.body.imageUrl || (req.file ? `/uploads/${req.file.filename}` : undefined),
      description: req.body.description,
      palluImageUrl: req.body.palluImageUrl || "",
      borderImageUrl: req.body.borderImageUrl || "",
      bodyImageUrl: req.body.bodyImageUrl || "",
      fabric: req.body.fabric || "",
      style: req.body.style || "",
      zariType: req.body.zariType || "",
      occasion: req.body.occasion || "",
      length: req.body.length || "6.3 meters with blouse",
      blouseStatus: req.body.blouseStatus || "Unstitched",
      vendorId: req.body.vendorId || "",
      vendorName: req.body.vendorName || "",
      fallPico: parseBoolean(req.body.fallPico),
      customBlouseStitching: parseBoolean(req.body.customBlouseStitching),
      material: parseList(req.body.material),
      design: parseList(req.body.design),
      border: parseList(req.body.border),
      blouse: parseList(req.body.blouse),
      zariColour: parseList(req.body.zariColour),
      weave: parseList(req.body.weave),
      palluColour: parseList(req.body.palluColour),
      isNewArrival: req.body.isNewArrival !== "false",
      availability: req.body.availability || "available"
    };

    Object.keys(update).forEach((key) => update[key] === undefined && delete update[key]);

    const query = id && /^[a-f\d]{24}$/i.test(String(id))
      ? { _id: id }
      : { code };

    const saree = await Saree.findOneAndUpdate(query, update, {
      new: true,
      runValidators: true
    });

    if (!saree) {
      res.status(404).json({ message: "Saree not found" });
      return;
    }

    res.json(saree);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
