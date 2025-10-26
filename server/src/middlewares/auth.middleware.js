import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { ACCESS_TOKEN_SECRET } from "../config/index.js";

const verifyJWT = asyncHandler((req, _, next) => {          // _ is used to ignore the res parameter since we don't need it here
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")            // since we get accessToken in format: "Bearer <token>" in req header

    if (!token) {
        throw new ApiError(401, "Unauthorized: No token provided");
    }

    // verify token
    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        throw new ApiError(401, "Unauthorized: Invalid token");
    }
});

export { verifyJWT };