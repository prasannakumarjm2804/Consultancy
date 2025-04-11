const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  //console.log("🔍 Received Authorization Header:", authHeader);

  if (!authHeader) {
    console.log("❌ No Authorization header found");
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(' ')[1];
  //console.log("🔑 Extracted Token:", token);

  if (!token) {
    console.log("❌ No Token found in Authorization header");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    //console.log("✅ Decoded Token:", decoded);
    req.user = { userId: decoded.id, name: decoded.name, email: decoded.email };
    next();
  } catch (err) {
    console.error("❌ Token Verification Failed:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { authenticate };
