import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { BCRYPT_SALT_ROUNDS, OTP_TOKEN_SECRET, OTP_TOKEN_EXPIRY } from "../config/index.js";

const resetOTPSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    otp: {
        type: String,
        required: true
    }
}, { timestamps: true });

resetOTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });    // TTL index to auto-delete documents after 10 minutes

resetOTPSchema.pre('save', async function (next) {
    if (this.isModified("otp")) {
        this.otp = await bcrypt.hash(this.otp, BCRYPT_SALT_ROUNDS);
    }
    next();
});

resetOTPSchema.methods.compareOtp = async function (candidateOtp) {
    return await bcrypt.compare(candidateOtp, this.otp);
}

resetOTPSchema.methods.generateOtpToken = function () {
    return jwt.sign(
        {
            _id: this.userId,
            action: "reset_password"
        },
        OTP_TOKEN_SECRET,
        {
            expiresIn: OTP_TOKEN_EXPIRY
        }
    )
}

const ResetOTP = mongoose.model("ResetOTP", resetOTPSchema);
export default ResetOTP;