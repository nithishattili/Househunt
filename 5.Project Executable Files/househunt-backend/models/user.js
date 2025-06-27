// backend/models/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, unique: true, lowercase: true, trim: true },
    password: String,

    role: {
      type: String,
      enum: ["renter", "owner", "admin"],
      default: "renter",
    },
    phone: { type: String },
    // 🔑 Replace boolean with enum
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: function () {
        return this.role === "owner" ? "pending" : "approved";
      },
    },
  },
  { timestamps: true }
);

// optional: index for faster admin queries
userSchema.index({ role: 1, status: 1 });

export default mongoose.model("User", userSchema);
