// backend/routes/property.js
import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import { fileURLToPath } from "url";

import Property from "../models/property.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ─────────────────── ensure uploads dir exists ─────────────────── */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

/* ─────────────────── Multer → save tmp file ────────────────────── */
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) =>
    cb(null, "tmp-" + Date.now() + path.extname(file.originalname)),
});
const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    const ok = /jpe?g|png$/i.test(path.extname(file.originalname));
    cb(ok ? null : new Error("Only .jpg, .jpeg, .png allowed"), ok);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

/* ─────────────────── sharp resize helper ───────────────────────── */
async function optimise(tmp) {
  const id = uuid();
  const outPath = path.join(UPLOAD_DIR, `${id}.jpg`);
  await sharp(tmp)
    .resize({ width: 1200 })
    .jpeg({ quality: 80 })
    .toFile(outPath);
  fs.unlink(tmp, () => {}); // delete temp
  return `/uploads/${id}.jpg`;
}

/* ─────────────────── error helper ──────────────────────────────── */
const fail = (res, err, msg) => {
  console.error(err);
  res.status(500).json({ message: msg, error: err.message });
};

/* ══════════════════  POST /api/property/add  ═════════════════════ */
/* Owner only → authMiddleware should verify role === "owner"        */
router.post(
  "/add",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, description, location, rent, bedrooms } = req.body;
      if (!title || !location || !rent) {
        return res
          .status(400)
          .json({ message: "Title, location & rent are required." });
      }

      const imageUrl = req.file ? await optimise(req.file.path) : "";

      const newProperty = await Property.create({
        ownerId: req.user.userId, // ✅ correct field
        title,
        description,
        location,
        rent: Number(rent),
        bedrooms: bedrooms ? Number(bedrooms) : undefined,
        imageUrl,
      });

      res
        .status(201)
        .json({
          message: "Property added successfully",
          property: newProperty,
        });
    } catch (err) {
      fail(res, err, "Failed to add property");
    }
  }
);

/* ══════════════════  GET /api/property  (public)  ════════════════ */
router.get("/", async (_req, res) => {
  try {
    // optional populate — safe now, uses ownerId
    const properties = await Property.find().populate("ownerId", "name email");
    res.json(properties);
  } catch (err) {
    fail(res, err, "Failed to fetch properties");
  }
});

export default router;
