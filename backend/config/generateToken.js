// this is for generate unique web token

import jwt from "jsonwebtoken"; // Import the jsonwebtoken library

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { // Sign a new token with the user ID and secret key
        expiresIn: "30d", // Set the token expiration time to 30 days
    });
}; // Return the generated token

export default generateToken; // Export the generateToken function for use in other files