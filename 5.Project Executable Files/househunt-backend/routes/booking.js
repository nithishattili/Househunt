import express from "express";
import Booking from "../models/booking.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Property from "../models/property.js";
const router = express.Router();

// 🔐 POST: Create booking with auth
// routes/booking.js  (or wherever your request endpoint is)
router.post("/request", authMiddleware, async (req, res) => {
  try {
    const { propertyId, message } = req.body;

    // 1) fetch property so we know the owner
    const prop = await Property.findById(propertyId).select("ownerId title");
    if (!prop) return res.status(404).json({ message: "Property not found" });

    // 2) create booking with *all three* IDs
    const booking = await Booking.create({
      renter: req.user.userId, // renterId in your schema
      ownerId: prop.ownerId, // <-- add this field to schema or rename
      property: propertyId,
      propertyTitle: prop.title, // optional cached title
      message,
      status: "pending",
    });

    res.status(201).json({ message: "Request sent", booking });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to create booking", error: err.message });
  }
});
// GET  /api/bookings/mine   –  renter's dashboard
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const list = await Booking.find({ renter: req.user.userId })
      .sort({ createdAt: -1 })
      .populate("property", "title location")
      .populate("ownerId", "name email phone"); // 👈 add owner details

    // flatten the JSON we return to the front-end
    res.json(
      list.map((b) => ({
        _id: b._id,
        propertyTitle: b.property?.title,
        propertyLocation: b.property?.location,
        ownerName: b.ownerId?.name,
        ownerEmail: b.ownerId?.email,
        ownerPhone: b.ownerId?.phone, // only if you store phone in User model
        message: b.message,
        status: b.status,
        createdAt: b.createdAt,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

export default router;
