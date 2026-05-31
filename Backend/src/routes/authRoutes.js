const express = require("express");
const User = require("../models/User");
const { hashPassword, verifyPassword } = require("../utils/password");
const { signToken } = require("../utils/token");

const router = express.Router();

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

module.exports = router;
