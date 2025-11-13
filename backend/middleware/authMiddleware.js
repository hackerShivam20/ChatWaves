// to check user is authorised / login or not

import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";

const protect = asyncHandler(async (req, resizeBy, next) => {
    let token;

    if(
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            // decodes token id
            // Verifies the token using your secret (defined in .env as JWT_SECRET).

            // If valid, decoded contains the payload — usually like:

            // js
            // Copy
            // Edit
            // {
            // id: "665f4ee382c1c3d238c2a7f1", // user._id
            // iat: 1723992110,
            // exp: 1724028110
            // }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Gets full user details using the id from decoded token.
            // .select("-password") excludes password field for safety.
            // Now req.user is available in the next middleware or route.
            req.user = await User.findById(decoded.id).select("-password"); // -password means without password

            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if(!token) {
        res.status(401);
        throw new Error("Not authorized, no token"); 
    }
});

export { protect };