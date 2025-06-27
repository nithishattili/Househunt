// backend/middleware/roles.js
import jwt from "jsonwebtoken";

/**
 * Decodes the JWT once and stores the payload on req.user.
 * If no token or invalid → 401.
 */
export const requireAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role, status }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * Owner-only guard.
 * Must be called AFTER requireAuth in a route chain or imported together.
 */
export const isOwner = (req, res, next) => {
  if (req.user?.role === "owner" && req.user?.status === "approved") {
    return next();
  }
  res.status(403).json({ message: "Owner access only" });
};

/**
 * Admin-only guard.
 */
export const isAdmin = (req, res, next) => {
  if (req.user?.role === "admin") return next();
  res.status(403).json({ message: "Admin access only" });
};
