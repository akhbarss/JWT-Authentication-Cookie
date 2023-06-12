import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { ConnectOptions } from "mongoose";
import cors from "cors";

require("dotenv").config();

const app = express();

// Set up middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3001", "http://localhost:5173"],
  })
);

// Set up MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/node_refreshToken", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Set up routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// Start the server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
