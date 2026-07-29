const express = require("express");
const cors = require("cors");
const path = require("path");
const sareeRoutes = require("./routes/sareeRoutes");
const authRoutes = require("./routes/authRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.json({
    name: "Sahanvi Handloom Sarees API",
    status: "running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    database: "configured"
  });
});

app.use("/api/sarees", sareeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/testimonials", testimonialRoutes);

app.use((error, req, res, next) => {
  res.status(500).json({
    message: error.message || "Something went wrong."
  });
});

module.exports = app;
