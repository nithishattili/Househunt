import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import authMiddleware from "./middleware/authMiddleware.js";
import propertyRoutes from "./routes/property.js";
import bookingRoutes from "./routes/booking.js";
import adminRoutes from "./routes/admin.js";
import ownerRoutes from "./routes/owner.js";
import publicRoutes from "./routes/public.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "")),
});
const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    // accept jpg/jpeg/png only
    const ok = /jpe?g|png$/i.test(path.extname(file.originalname));
    cb(null, ok);
  },
});
// Global middlewares
app.use(cors());
app.use(express.json());

// ✅ Log every incoming request (add this for debugging)
app.use((req, res, next) => {
  console.log(`🛬 Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", publicRoutes);
// ✅ Protected route
app.get("/api/protected", authMiddleware, (req, res) => {
  console.log("🔐 Protected route hit");
  res.json({
    message: "✅ Protected access granted",
    user: req.user,
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
