const { createServer } = require("http");
const next = require("next");
const { loadEnvConfig } = require("@next/env");

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = Number(process.env.PORT || 3000);

console.log("Server starting...");
console.log("MONGO_URI:", !!process.env.MONGO_URI);
console.log("MONGODB_URI:", !!process.env.MONGODB_URI);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      await handle(req, res);
    } catch (error) {
      console.error("Server request failed:", error);
      res.statusCode = 500;
      res.end("Internal server error");
    }
  }).listen(port, () => {
    console.log(`Ready on http://${hostname}:${port}`);
  });
});
