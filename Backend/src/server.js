require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("Server starting...");
    console.log("MONGODB_URI configured:", Boolean(process.env.MONGODB_URI));
    console.log("AUTH_SECRET configured:", Boolean(process.env.AUTH_SECRET));

    await connectDB();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

startServer();
