const { verifyToken } = require("../utils/token");

function getAuthUser(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  return verifyToken(token);
}

function requireAdmin(req, res, next) {
  const user = getAuthUser(req);
  if (!user || user.role !== "admin") {
    res.status(401).json({ message: "Admin sign-in required." });
    return;
  }
  req.user = user;
  next();
}

module.exports = {
  getAuthUser,
  requireAdmin
};
