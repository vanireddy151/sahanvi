const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const { hashPassword, verifyPassword } = require("../utils/password");
const { signToken } = require("../utils/token");
const { getAuthUser } = require("../middleware/auth");

const router = express.Router();

function makeTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role
});

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, phone = "", password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Name, email, and password are required." });
      return;
    }

    const passwordFields = hashPassword(password);
    const user = await User.create({
      name,
      email,
      phone,
      ...passwordFields
    });

    res.status(201).json({
      user: publicUser(user),
      token: signToken({ id: user._id, role: user.role })
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ message: "This email is already registered." });
      return;
    }
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || "").toLowerCase() });

    if (!user || !verifyPassword(password || "", user)) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    res.json({
      user: publicUser(user),
      token: signToken({ id: user._id, role: user.role })
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", async (req, res, next) => {
  try {
    const tokenUser = getAuthUser(req);
    if (!tokenUser) {
      res.status(401).json({ message: "Not signed in." });
      return;
    }

    const user = await User.findById(tokenUser.id);
    if (!user) {
      res.status(401).json({ message: "Not signed in." });
      return;
    }

    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post("/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "Email is required." });
      return;
    }

    const user = await User.findOne({ email: String(email).toLowerCase() });
    // Always respond with success to avoid user enumeration
    if (!user) {
      res.json({ message: "If that email is registered, a reset link has been sent." });
      return;
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "https://sahanvi-puce.vercel.app";
    const resetLink = `${frontendUrl}/reset-password?token=${rawToken}`;

    // Respond immediately — don't block on SMTP
    res.json({ message: "If that email is registered, a reset link has been sent." });

    // Send email in background after responding
    const transporter = makeTransporter();
    transporter.sendMail({
      from: `"Sahanvi Handloom" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset your Sahanvi password",
      html: `
        <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#2a1a0e;">
          <h2 style="color:#5a2f1d;">Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>We received a request to reset the password for your Sahanvi account. Click the link below to set a new password:</p>
          <p style="margin:24px 0;">
            <a href="${resetLink}" style="background:#5a2f1d;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-family:Inter,sans-serif;">Reset Password</a>
          </p>
          <p style="color:#9c8677;font-size:13px;">This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.</p>
          <hr style="border:none;border-top:1px solid #eadbd0;margin:24px 0;" />
          <p style="color:#9c8677;font-size:12px;">Sahanvi Handloom Sarees &mdash; Cherished Traditions, Timeless Elegance</p>
        </div>
      `
    }).catch((err) => console.error("Reset email send failed:", err));
  } catch (error) {
    next(error);
  }
});

router.post("/reset-password", async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      res.status(400).json({ message: "Token and new password are required." });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ message: "Password must be at least 8 characters." });
      return;
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      res.status(400).json({ message: "This reset link is invalid or has expired." });
      return;
    }

    const passwordFields = hashPassword(password);
    user.passwordHash = passwordFields.passwordHash;
    user.passwordSalt = passwordFields.passwordSalt;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password updated successfully. You can now sign in." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
