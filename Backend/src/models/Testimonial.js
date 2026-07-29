const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    caption: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
