// backend/models/property.js
import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    ownerId: mongoose.Schema.Types.ObjectId,

    /* core info */
    title: { type: String, required: true },
    description: { type: String },
    rent: { type: Number, required: true },
    location: { type: String, required: true },

    /* detailed specs */
    bedrooms: { type: Number, min: 0 },
    bathrooms: { type: Number, min: 0 },
    size: { type: Number }, // sq-ft
    furnished: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ["apartment", "house", "villa"],
      default: "apartment",
    },

    /* image path */
    imageUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("Property", propertySchema);
