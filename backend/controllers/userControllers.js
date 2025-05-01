// for user register

import asyncHandler from "express-async-handler"; // Middleware for handling async errors
import { User } from "../models/userModel.js"; // Import the User model
import generateToken from "../config/generateToken.js"; // Import the token generation function

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body; // Destructure the request body

    // Check if all required fields are provided
    if (!name || !email || !password) {
        res.status(400); // Set response status to 400 (Bad Request)
        throw new Error("Please enter all fields"); // Throw an error if any field is missing
        return;
    }

    // Check if password length is less than 6 characters
    // if (password.length < 6) {
    //     res.status(400); // Set response status to 400 (Bad Request)
    //     throw new Error("Password must be at least 6 characters"); // Throw an error if password is too short
    //     return;
    // }

    // // Check if password length is greater than 20 characters
    // if (password.length > 20) {
    //     res.status(400); // Set response status to 400 (Bad Request)
    //     throw new Error("Password must be less than 20 characters"); // Throw an error if password is too long
    //     return;
    // }

    // Check if user already exists
    const userExists = await User.findOne({ email }); // Check if a user with the same email already exists

    if (userExists) {
        // res.status(400).json({ message: "User already exists" }); // Send error response if user exists
        res.status(400);
        throw new Error("User already exists"); // Throw an error if user exists
        return;
    }

    // Create a new user
    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    // Check if user was created successfully
    if (user) {
        res.status(201).json({
            _id: user._id, // Send user ID in the response
            name: user.name, // Send user name in the response
            email: user.email, // Send user email in the response
            pic: user.pic, // Send user profile picture in the response
            token: generateToken(user._id), // Generate and send a token for authentication
        });
    } else {
        res.status(400); // Set response status to 400 (Bad Request)
        throw new Error("Failed to create the user"); // Throw an error if user creation failed
    }
});

// for login user function
const authUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body; // Destructure the request body

    // Check if all required fields are provided
    if (!email || !password) {
        res.status(400); // Set response status to 400 (Bad Request)
        throw new Error("Please enter all fields"); // Throw an error if any field is missing
        return;
    }

    // Find the user by email and check if password matches
    const user = await User.findOne({ email }); // Find user by email

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id, // Send user ID in the response
            name: user.name, // Send user name in the response
            email: user.email, // Send user email in the response
            pic: user.pic, // Send user profile picture in the response
            token: generateToken(user._id), // Generate and send a token for authentication
        });
    } else {
        res.status(401); // Set response status to 401 (Unauthorized)
        throw new Error("Invalid email or password"); // Throw an error if credentials are invalid
    }
});

export { registerUser, authUser }; // Export the registerUser function for use in routes