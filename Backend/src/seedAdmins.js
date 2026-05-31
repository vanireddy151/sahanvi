require("dotenv").config();

const connectDB = require("./config/db");
const User = require("./models/User");
const { hashPassword } = require("./utils/password");

const adminConfigs = [
  {
    name: process.env.ADMIN_1_NAME,
    email: process.env.ADMIN_1_EMAIL,
    phone: process.env.ADMIN_1_PHONE,
    password: process.env.ADMIN_1_PASSWORD
  },
  {
    name: process.env.ADMIN_2_NAME,
    email: process.env.ADMIN_2_EMAIL,
    phone: process.env.ADMIN_2_PHONE,
    password: process.env.ADMIN_2_PASSWORD
  }
].filter((admin) => admin.name && admin.email && admin.password);

const seedAdmins = async () => {
  await connectDB();

  for (const admin of adminConfigs) {
    const passwordFields = hashPassword(admin.password);
    await User.findOneAndUpdate(
      { email: admin.email.toLowerCase() },
      {
        name: admin.name,
        email: admin.email.toLowerCase(),
        phone: admin.phone,
        role: "admin",
        ...passwordFields
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`Admin ready: ${admin.email}`);
  }

  console.log("Admin seeding complete.");
  process.exit(0);
};

seedAdmins().catch((error) => {
  console.error("Admin seeding failed:", error.message);
  process.exit(1);
});
