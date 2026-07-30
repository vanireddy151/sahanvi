const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String, default: "" },
    caption: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
