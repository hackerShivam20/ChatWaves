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
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

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