import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import cors from 'cors'

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  };

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cors(corsOptions));


// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI as string, {
    serverSelectionTimeoutMS: 10000, 
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));



  app.use("/api/auth", authRoutes)
  app.use("/api/tasks", taskRoutes)


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));