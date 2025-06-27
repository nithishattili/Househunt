import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify admin token
const isAdmin = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token provided" });

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// 🔍 Get all pending owners
router.get("/owners/pending", isAdmin, async (req, res) => {
  try {
    const owners = await User.find({ role: "owner", status: "pending" }).select(
      "-password"
    );
    res.json(owners);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Approve owner
router.put("/owners/:id/approve", isAdmin, async (req, res) => {
  try {
    const owner = await User.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    ).select("-password");
    if (!owner) return res.status(404).json({ message: "Owner not found" });
    res.json({ message: "Owner approved", owner });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
