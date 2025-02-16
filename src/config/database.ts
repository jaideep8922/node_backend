import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load .env file

const app = express();
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI as string, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
