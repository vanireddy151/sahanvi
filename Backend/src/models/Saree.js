const mongoose = require("mongoose");

const sareeSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Heritage Sarees", "Signature Sarees", "Sarees", "Sahanvi Vintage"],
      required: true
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    imageUrl: {
      type: String,
      required: true
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    material: {
      type: [String],
      default: []
    },
    design: {
      type: [String],
      default: []
    },
    border: {
      type: [String],
      default: []
    },
    blouse: {
      type: [String],
      default: []
    },
    zariColour: {
      type: [String],
      default: []
    },
    weave: {
      type: [String],
      default: []
    },
    palluColour: {
      type: [String],
      default: []
    },
    isNewArrival: {
      type: Boolean,
      default: true
    },
    availability: {
      type: String,
      enum: ["available", "sold", "hidden"],
      default: "available"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Saree", sareeSchema);
