require("dotenv").config();

const connectDB = require("./config/db");
const Saree = require("./models/Saree");
const User = require("./models/User");
const Inquiry = require("./models/Inquiry");

const setupDatabase = async () => {
  await connectDB();

  await User.init();
  await Saree.init();
  await Inquiry.init();

  console.log("MongoDB database is ready.");
  console.log("Database:", process.env.MONGODB_URI);
  process.exit(0);
};

setupDatabase().catch((error) => {
  console.error("MongoDB setup failed:", error.message);
  process.exit(1);
});
