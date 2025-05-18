import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // Import the database connection function
import userRoutes from "./routes/userRoutes.js"; // Import user routes
import chatRoutes from "./routes/chatRoutes.js"; // Import chat routes
import messageRoutes from "./routes/messageRoutes.js"; // Import message routes
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"; // Import error handling middleware
import mongoose from "mongoose"; // Import mongoose for MongoDB connection
import { Server } from "socket.io"; // ✅ Correct ESM import for socket.io
import http from "http"; // Needed to create HTTP server for Socket.io
import { log } from "console";

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
app.use("/api/message", messageRoutes); // create api for message creation

// function to handle when user go on another route
app.use(notFound); // Handle 404 errors
app.use(errorHandler); // Handle other errors

// const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Attach Socket.io to server
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:5173",
    },
  });
  
  io.on("connection", (socket) => {
    console.log("New user connected");

    // take user from frontend  or data to join a room
    socket.on("setup", (userData) => {
      socket.join(userData._id); // Join the user to their own room
      console.log(`User ${userData._id} joined room`);
      
      socket.emit("connected"); // Emit a connected event to the client
    });

    // to joining a chat
    socket.on("join chat", (room) => {
      socket.join(room); // Join the chat room
      console.log(`User joined room: ${room}`);
    });

    // socket for send or new message
    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if(!chat.users) return console.log(`chat.users not defined`);

        // suppose we have 5 users the message emitted to only 4 users excluding me
        chat.users.forEach(user => {
            if(user._id == newMessageReceived.sender._id) return; // if message is send by us , then simply return

            socket.in(user._id).emit("message received", newMessageReceived); // user room that created above with user._id
        });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  // ✅ Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });