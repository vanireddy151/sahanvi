const fs = require("fs");
const path = require("path");
const express = require("express");
const Testimonial = require("../models/Testimonial");
const { requireAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: 1 });
    res.json(testimonials);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAdmin, upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "An image file is required." });
      return;
    }

    const testimonial = await Testimonial.create({
      imageUrl: `/uploads/${req.file.filename}`,
      caption: req.body.caption || ""
    });

    res.status(201).json(testimonial);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      res.status(404).json({ message: "Testimonial not found." });
      return;
    }

    if (testimonial.imageUrl.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "../../uploads", path.basename(testimonial.imageUrl));
      fs.unlink(filePath, () => {});
    }

    res.json({ message: "Testimonial removed." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
