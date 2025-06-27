// backend/routes/owner.js
import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import { fileURLToPath } from "url";

import Property from "../models/property.js";
import Booking from "../models/booking.js";
import { requireAuth, isOwner } from "../middleware/roles.js";

const router = express.Router();

/* ──────────────────────────────────────────
   ensure uploads directory exists
────────────────────────────────────────── */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

/* ──────────────────────────────────────────
   Multer setup
────────────────────────────────────────── */
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) =>
    cb(null, "tmp-" + Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const ok =
      /jpe?g|png$/.test(ext) && /image\/(jpeg|png)/.test(file.mimetype);
    cb(ok ? null : new Error("Only .jpg, .jpeg & .png allowed"), ok);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

/* ──────────────────────────────────────────
   helper: optimise image → /uploads/{uuid}.jpg
────────────────────────────────────────── */
async function processImage(tmpPath) {
  const id = uuid();
  const outPath = path.join(UPLOAD_DIR, `${id}.jpg`);
  try {
    await sharp(tmpPath)
      .resize({ width: 1200 })
      .jpeg({ quality: 80 })
      .toFile(outPath);
    fs.unlink(tmpPath, () => {}); // delete temp
    return `/uploads/${id}.jpg`;
  } catch (err) {
    console.error("⚠️  Sharp failed, keeping original:", err.message);
    const fallback = path.join(UPLOAD_DIR, `${id}${path.extname(tmpPath)}`);
    fs.renameSync(tmpPath, fallback);
    return `/uploads/${path.basename(fallback)}`;
  }
}

/* ──────────────────────────────────────────
   shared error helper
────────────────────────────────────────── */
function handleError(res, err, msg = "Server error") {
  console.error(err);
  res.status(500).json({ message: msg });
}

/* ──────────────────────────────────────────
   CRUD: Properties
────────────────────────────────────────── */
router.get("/properties", requireAuth, isOwner, async (req, res) => {
  const list = await Property.find({ ownerId: req.user.userId });
  res.json(list);
});

router.post(
  "/properties",
  requireAuth,
  isOwner,
  upload.single("image"),
  async (req, res) => {
    try {
      const imageUrl = req.file ? await processImage(req.file.path) : "";

      const numeric = (key) =>
        req.body[key] !== undefined ? Number(req.body[key]) : undefined;

      const property = await Property.create({
        ownerId: req.user.userId,
        imageUrl,
        title: req.body.title,
        description: req.body.description,
        rent: numeric("rent"),
        location: req.body.location,
        bedrooms: numeric("bedrooms"),
        bathrooms: numeric("bathrooms"),
        size: numeric("size"),
        furnished: req.body.furnished === "true" || req.body.furnished === true,
        type: req.body.type,
      });
      res.status(201).json(property);
    } catch (err) {
      handleError(res, err, "Failed to add property");
    }
  }
);

router.patch(
  "/properties/:id",
  requireAuth,
  isOwner,
  upload.single("image"),
  async (req, res) => {
    try {
      const update = {
        ...req.body,
        rent: req.body.rent ? Number(req.body.rent) : undefined,
        bedrooms: req.body.bedrooms ? Number(req.body.bedrooms) : undefined,
        bathrooms: req.body.bathrooms ? Number(req.body.bathrooms) : undefined,
        size: req.body.size ? Number(req.body.size) : undefined,
        furnished:
          req.body.furnished !== undefined
            ? req.body.furnished === "true" || req.body.furnished === true
            : undefined,
      };
      if (req.file) update.imageUrl = await processImage(req.file.path);

      const prop = await Property.findOneAndUpdate(
        { _id: req.params.id, ownerId: req.user.userId },
        update,
        { new: true }
      );
      if (!prop) return res.sendStatus(404);
      res.json(prop);
    } catch (err) {
      handleError(res, err, "Failed to update property");
    }
  }
);

router.delete("/properties/:id", requireAuth, isOwner, async (req, res) => {
  await Property.deleteOne({ _id: req.params.id, ownerId: req.user.userId });
  res.sendStatus(204);
});

/* ──────────────────────────────────────────
   Incoming bookings
────────────────────────────────────────── */
// in routes/owner.js
router.get("/bookings", requireAuth, isOwner, async (req, res) => {
  const bookings = await Booking.find({ ownerId: req.user.userId })
    .sort({ createdAt: -1 })
    .populate("renter", "name email")
    .populate("property", "title"); // ← quick access to title

  res.json(
    bookings.map((b) => ({
      _id: b._id,
      renterName: b.renter?.name,
      renterEmail: b.renter?.email,
      propertyTitle: b.property?.title,
      message: b.message,
      status: b.status,
      createdAt: b.createdAt,
    }))
  );
});

router.patch("/bookings/:id/status", requireAuth, isOwner, async (req, res) => {
  const booking = await Booking.findOneAndUpdate(
    { _id: req.params.id, ownerId: req.user.userId },
    { status: req.body.status },
    { new: true }
  );
  if (!booking) return res.sendStatus(404);
  res.json(booking);
});

export default router;
