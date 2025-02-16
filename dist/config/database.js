"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // ✅ Load .env file
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
mongoose_1.default
    .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => console.error("❌ MongoDB Connection Failed:", err));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
