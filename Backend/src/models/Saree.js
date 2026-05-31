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
    isNewArrival: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Saree", sareeSchema);
