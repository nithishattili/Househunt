// backend/routes/auth.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";
import User from "../models/user.js";

const router = express.Router();

/* --------------------------------------------------
   Helpers
--------------------------------------------------- */
const allowedRoles = ["renter", "owner", "admin"];

const generateToken = (user) =>
  jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
      status: user.status,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "2h" }
  );

/* --------------------------------------------------
   Register
--------------------------------------------------- */
router.post("/register", async (req, res) => {
  try {
    let { name, email, password, role = "renter", phone = "" } = req.body;

    /* ─ Basic validation ─ */
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Name, email & password are required." });

    if (!allowedRoles.includes(role))
      return res.status(400).json({ message: "Invalid role." });

    /* phone required for owners */
    phone = phone.trim();
    if (role === "owner" && !phone)
      return res
        .status(400)
        .json({ message: "Phone number is required for owners." });

    /* weak password guard (≥ 6 chars, 1 digit) */
    if (password.length < 6 || !/\d/.test(password))
      return res
        .status(422)
        .json({ message: "Password must be ≥6 chars and include a number." });

    /* ─ Uniqueness checks ─ */
    email = email.toLowerCase().trim();
    if (await User.findOne({ email }))
      return res.status(409).json({ message: "Email already registered." });

    if (phone && (await User.findOne({ phone })))
      return res.status(409).json({ message: "Phone already registered." });

    /* ─ Create user ─ */
    const status = role === "owner" ? "pending" : "approved";
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
      role,
      status,
    });

    /* Owners must wait; renters get token right away */
    const token = status === "approved" ? generateToken(user) : null;
    const payload = token
      ? JSON.parse(Buffer.from(token.split(".")[1], "base64"))
      : null;

    res.status(201).json({
      message: "Registration successful",
      user: { id: user._id, name, email, phone, role, status },
      token,
      tokenPayload: payload,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* --------------------------------------------------
   Login
--------------------------------------------------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email & password required." });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    /* Safeguard: ensure status exists */
    if (!user.status) {
      user.status = user.role === "owner" ? "pending" : "approved";
      await user.save();
    }

    /* Block unapproved owners */
    if (user.status !== "approved" && user.role !== "admin")
      return res.status(403).json({ message: "Account pending approval" });

    /* Check password */
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    /* Success */
    const token = generateToken(user);
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64"));

    res.json({
      message: "Login successful",
      token,
      tokenPayload: payload,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
