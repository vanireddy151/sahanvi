const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    passwordHash: {
      type: String,
      required: true
    },
    passwordSalt: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer"
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    emailVerified: { type: Boolean, default: true },
    verificationToken: { type: String },
    verificationExpires: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
