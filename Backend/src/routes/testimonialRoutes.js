const express = require("express");
const Testimonial = require("../models/Testimonial");
const { requireAdmin } = require("../middleware/auth");
const uploadMemory = require("../middleware/uploadMemory");
const cloudinary = require("../utils/cloudinary");

const router = express.Router();

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "sahanvi/client-diaries" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

router.get("/", async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: 1 });
    res.json(testimonials);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAdmin, uploadMemory.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "An image file is required." });
      return;
    }

    const result = await uploadToCloudinary(req.file.buffer);

    const testimonial = await Testimonial.create({
      imageUrl: result.secure_url,
      imagePublicId: result.public_id,
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

    if (testimonial.imagePublicId) {
      cloudinary.uploader.destroy(testimonial.imagePublicId).catch(() => {});
    }

    res.json({ message: "Testimonial removed." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
