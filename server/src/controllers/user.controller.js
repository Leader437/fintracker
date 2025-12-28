import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/user.model.js';
import ResetOTP from '../models/passwordReset.model.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import sendMail from '../utils/sendMail.js';
import ApiResponse from '../utils/ApiResponse.js';
import { REFRESH_TOKEN_SECRET, OTP_TOKEN_SECRET } from '../config/index.js';
import jwt from 'jsonwebtoken';

const generateAccessAndRefreshTokens = async (user) => {
    try {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;   // storing the refresh token in the database
        await user.save({ validateBeforeSave: false });                   // saving the updated user document       // skipping validation because if we don't do that, it will throw error if some other required field is missing or invalid while saving

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error generating tokens");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    // checking if any of the info is missing
    if ([username, email, password].some(field => field?.trim() === "")) {        // returning true if even one of the field is empty
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
        avatar: req.body.avatar || ""
    })

    // fetch the full user document (with refreshToken field)
    const fullUser = await User.findById(user._id);
    if (!fullUser) {
        throw new ApiError(500, "Something went wrong while creating the user");
    }

    // generating tokens to make the user logged in automatically after registration
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(fullUser);

    // fetch user for response (exclude password and refreshToken)
    const createdUser = await User.findById(user._id).select('-password -refreshToken');

    const options = {
        httpOnly: true,      // cookie cannot be updated from client-side
        secure: true,
    };

    // sending success response and setting tokens in cookie to login user automatically
    res.status(201)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(new ApiResponse(201, createdUser, 'User registered successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // input validation
    if ([email, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // check if user exists
    const user = await User.findOne({ email: email })
    if (!user) {
        throw new ApiError(409, "User with email does not exist")
    }

    // check password validation
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user);

    // fetching updated user details after adding refresh token excluding password and refreshToken fields
    const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

    const options = {
        httpOnly: true,      // cookie cannot be updated from client-side
        secure: true,
    };

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken }, 'User logged in successfully'));
});

const forgotPassword = asyncHandler(async (req, res) => {
    // get email from user
    const email = req.body?.email;

    if (!email || email.trim() === "") {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError("User with email doesn't exist");
    }

    // delete any existing OTPs for the user in case user requested another otp before the previous was automatically deleted
    await ResetOTP.deleteMany({ userId: user._id });

    // generate 4 digit otp
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // ensures 4-digit

    // saving new otp in database
    await ResetOTP.create({
        userId: user._id,
        otp,
    })

    // send otp to user via mail
    await sendMail(user.email, "Password Reset OTP", `Hello ${user.name},\n\nYour OTP is ${otp}.\nIt will expire in 10 minutes.`);

    // sending success response
    res.status(201).json({ message: "OTP sent successfully" });
});

const verifyOTP = asyncHandler(async (req, res) => {
    // get email and otp from user
    const { email, otp } = req.body;

    // verify email and otp existence
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, "User with email doesn't exist");
    }

    const resetOtp = await ResetOTP.findOne({ userId: user._id });

    if (!resetOtp) {
        throw new ApiError(400, "no otp available for this user")
    }

    // verify otp
    const otpCorrect = await resetOtp.compareOtp(otp);

    if (!otpCorrect) {
        throw new ApiError(400, "Invalid OTP");
    }

    // upon correct otp send a reset jwt token to the client with a 10m time limit
    const resetToken = resetOtp.generateOtpToken();
    // send success response

    res.status(200).json(new ApiResponse(200, resetToken, "reset token generated successfully"));
});

const resetPassword = asyncHandler(async (req, res) => {
    // get reset token and new password from user
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
        throw new ApiError(400, "reset token or password not found");
    }

    // verify reset token
    let decodedToken;
    try {
        decodedToken = jwt.verify(resetToken, OTP_TOKEN_SECRET);
    } catch (err) {
        throw new ApiError(401, "Invalid or expired reset token");
    }

    // verify action in token
    if (decodedToken.action !== "reset_password") {
        throw new ApiError(401, "Invalid reset token");
    }

    // find the user and update the password
    const user = await User.findById(decodedToken._id);
    if (!user) {
        throw new ApiError(400, "User not found");
    }

    user.password = newPassword;
    await user.save();

    if (!user) {
        throw new ApiError(400, "User not found");
    }

    // delete any existing OTPs for the user
    await ResetOTP.deleteMany({ userId: user._id });

    // send success response
    res.status(200).json(new ApiResponse(200, {}, "Password reset successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Invalidate refresh token
    await User.findByIdAndUpdate(userId, { $set: { refreshToken: null } });

    const options = {
        httpOnly: true,
        secure: true,
        expires: new Date(0),  // Set cookie expiration to the past
    };

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse(200, null, 'User logged out successfully'));
});

const updateUserDetail = asyncHandler(async (req, res) => {
    const { username, currency } = req.body;
    const user = req.user;

    // checking if any info is missing
    if ([username, currency].some(field => !field?.trim())) {        // returning true if even one of the field is empty
        throw new ApiError(400, "All fields are required");
    }

    // check for user in db and update details
    const updatedUser = await User.findByIdAndUpdate(user._id,
        { $set: { username, currency } },
        { new: true }                    // {new: true} means also return the new user document after update and .select("-password") will exclude password from it
    ).select("-password")

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    // return updated user details
    res.status(200).json(new ApiResponse(200, updatedUser, 'User details updated successfully'));
});

const updateUserDisplayPicture = asyncHandler(async (req, res) => {
    const { user } = req;

    // if file is present in the request, upload it to cloudinary and store the url in the request body
    const newAvatarLocalPath = req.file?.path;
    if (newAvatarLocalPath) {
        const uploadResult = await uploadOnCloudinary(newAvatarLocalPath)

        if (uploadResult?.secure_url) {
            req.body.avatar = uploadResult.secure_url;   // adding the avatar url to the request body to be saved in the database
        }
    }

    if (!req.body.avatar) {
        throw new ApiError(400, "No image provided");
    }

    // delete previous avatar from cloudinary if exists and is different from the new one
    if (user.avatar && user.avatar !== req.body.avatar) {
        await deleteFromCloudinary(user.avatar);
    }

    // update user display picture
    const updatedUser = await User.findByIdAndUpdate(user._id, {
        $set: {
            avatar: req.body.avatar
        }
    }, { new: true }).select('-password');

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    // return updated user details
    res.status(200).json(new ApiResponse(200, updatedUser, 'User display picture updated successfully'));
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken || req.header("x-refresh-token");

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized: No refresh token provided");
    }

    // verify refresh token
    try {
        const decoded = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded._id);

        if (!user || user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized: Invalid refresh token");
        }

        // generate new access token
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user);
        const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken }, 'Access token refreshed successfully'));
    } catch (error) {
        throw new ApiError(401, "Unauthorized: Invalid refresh token");
    }
});

const getUserProfile = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json(new ApiResponse(401, null, 'User not logged in'))
    }

    const foundUser = await User.findById(user._id).select('-password -refreshToken');

    if (!foundUser) {
        throw new ApiError(404, "User not found");
    }

    const userDetail = {
        _id: foundUser._id,
        name: foundUser.username,
        email: foundUser.email,
        currency: foundUser.currency,
        avatar: foundUser.avatar,
    }

    return res
        .status(200)
        .json(new ApiResponse(200, userDetail, 'User logged In'));
});

export { registerUser, loginUser, logoutUser, updateUserDetail, updateUserDisplayPicture, forgotPassword, verifyOTP, refreshAccessToken, resetPassword, getUserProfile };