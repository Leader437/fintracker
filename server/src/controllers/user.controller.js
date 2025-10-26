import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import ApiResponse from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, currency } = req.body

    // checking if any of the info is missing
    if ([username, email, password, currency].some(field => field?.trim() === "")) {        // returning true if even one of the field is empty
        throw new ApiError(400, "All fields are required");
    }

    // checking if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        throw new ApiError(409, "User with email already exists")
    }

    // if file is present in the request, upload it to cloudinary and store the url in the request body
    const avatarLocalPath = req.file?.path;
    if (avatarLocalPath) {
        const uploadResult = await uploadOnCloudinary(avatarLocalPath)

        if (uploadResult?.secure_url) {
            req.body.avatar = uploadResult.secure_url;   // adding the avatar url to the request body to be saved in the database
        }
    }

    // creating/saving the user
    const user = await User.create({
        username,
        email,
        password,
        avatar: req.body.avatar || "",
        currency
    })

    // confirming user creation and storing result excluding password, refreshToken in the createdUser
    const createdUser = await User.findById(user._id).select('-password -refreshToken');                 // .select() here is a built-in mongoose function which selects all the fields except the ones written in it's () with a '-'
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating the user");
    }

    res.status(201).json(new ApiResponse(201, createdUser, 'User registered successfully'));
});

export { registerUser };