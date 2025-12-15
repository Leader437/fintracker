import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    updateUserDetail,
    updateUserDisplayPicture,
    forgotPassword,
    verifyOTP,
    resetPassword
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(upload.single('avatar'), registerUser);
router.route('/login').post(loginUser);
router.route('/forgot-password').post(forgotPassword);
router.route('/verify-otp').post(verifyOTP);
router.route('/reset-password').post(resetPassword);

// secured routes
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/update-user-detail').post(verifyJWT, updateUserDetail);
router.route('/refresh-token').post(refreshAccessToken);          // no need to verify JWT here as we are already checking refresh tokens in the controller
router.route('/update-user-dp').post(verifyJWT, upload.single('avatar'), updateUserDisplayPicture)

export default router;