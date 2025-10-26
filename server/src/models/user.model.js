import mongoose from "mongoose"
import bcrypt from "bcrypt";
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } from "../config/index.js";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],    // this way we can optionally set an error message if the validation fails
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: [6, "Password must be at least 6 characters long"],     // not using 'min' here because it's for numbers only
        },
        refreshToken: {
            type: String,
            default: null,
            required: false,
        },
        avatar: {
            type: String,
            default: null,    // will add a placeholder url for users without a profile picture later
            required: false,
        },
        currency: {
            type: String,
            required: true,
            default: "USD"
        },
    },
    { timestamps: true }   // this will automatically add createdAt and updatedAt fields to the schema
)

userSchema.pre('save', async function (next) {              // pre is builtIn middleware to execute the given function just before any event ('save' in our case)
    if (this.isModified("password")) {                // only execute if the password field is modified (this includes setting it the first time as well)
        this.password = await bcrypt.hash(this.password, 10);   // hashing the password with a salt rounds of 10
    }
    next();
});

// adding a custom method to the userSchema to compare passwords during login
userSchema.methods.comparePassword = async function (candidatePassword) {             // not using arrow functions here cuz it doesn't have access to 'this'
    return await bcrypt.compare(candidatePassword, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email
        },
        ACCESS_TOKEN_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        REFRESH_TOKEN_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model("User", userSchema)     // this will create a collection named 'users' in MongoDB, automatically pluralizing and lowercasing the model name is standard behavior of Mongoose/mongodb

export default User