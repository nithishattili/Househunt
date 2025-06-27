// backend/routes/public.js
import express from "express";
import Property from "../models/property.js";

const router = express.Router();

/* Anyone (no auth) gets full list  */
router.get("/properties", async (req, res) => {
  try {
    const props = await Property.find();
    res.json(props);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
});

export default router;
