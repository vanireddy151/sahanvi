const path = require("path");
const express = require("express");
const multer = require("multer");
const Saree = require("../models/Saree");

const router = express.Router();

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

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Saree image is required." });
      return;
    }

    const saree = await Saree.create({
      category: req.body.category,
      type: req.body.type,
      name: req.body.name,
      code: req.body.code,
      price: Number(req.body.price),
      imageUrl: `/uploads/${req.file.filename}`,
      description: req.body.description,
      isNewArrival: req.body.isNewArrival !== "false"
    });

    res.status(201).json(saree);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
