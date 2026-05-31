const express = require("express");
const Inquiry = require("../models/Inquiry");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const inquiry = await Inquiry.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      subject: req.body.subject,
      message: req.body.message
    });

    res.status(201).json(inquiry);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
