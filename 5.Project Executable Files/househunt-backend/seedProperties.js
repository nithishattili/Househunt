import mongoose from "mongoose";
import dotenv from "dotenv";
import Property from "./models/property.js";
import User from "./models/user.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedProperties = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const owner = await User.findOne({ role: "owner" }); // Make sure at least one owner exists

    if (!owner) {
      console.log("❌ No owner user found. Please register an owner first.");
      return;
    }

    await Property.deleteMany(); // Optional: Clear existing data

    const dummyProperties = [
  {
    title: "Cozy Apartment in Banjara Hills",
    description: "A peaceful 2BHK with great view.",
    location: "Hyderabad",
    rent: 20000, // ← updated
    owner: owner._id,
  },
  {
    title: "Luxury Villa in Jubilee Hills",
    description: "Spacious 5BHK with a pool and garden.",
    location: "Hyderabad",
    rent: 120000, // ← updated
    owner: owner._id,
  },
  {
    title: "1BHK Near Hitech City",
    description: "Perfect for working professionals.",
    location: "Hyderabad",
    rent: 15000, // ← updated
    owner: owner._id,
  },
];


    await Property.insertMany(dummyProperties);
    console.log("🌱 Dummy properties inserted");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err.message);
    process.exit(1);
  }
};

seedProperties();
