import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // Import the database connection function
import userRoutes from "./routes/userRoutes.js"; // Import user routes
import chatRoutes from "./routes/chatRoutes.js"; // Import chat routes
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"; // Import error handling middleware
import mongoose from "mongoose"; // Import mongoose for MongoDB connection

dotenv.config();

connectDB(); // Connect to MongoDB

const app = express();
const PORT = process.env.PORT || 5000;

// to accept data in json format
app.use(express.json()); // Middleware to parse JSON data

// Enable CORS for frontend origin
app.use(cors({
    origin: "http://localhost:5173", // Allow frontend to access backend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is running");
});

// endpoints

app.use("/api/user", userRoutes); // User routes
app.use("/api/chat", chatRoutes); // create api for chat creation

// function to handle when user go on another route
app.use(notFound); // Handle 404 errors
app.use(errorHandler); // Handle other errors

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
