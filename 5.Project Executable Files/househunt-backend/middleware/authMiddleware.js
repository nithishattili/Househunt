import jwt from "jsonwebtoken";
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🔐 Authorization Header:", authHeader); // <== add this

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔐 Token received:", token); // <== add this
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { userId: ... }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
