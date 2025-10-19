import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],    // this way we can optionally set an error message if the validation fails
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
        profilePicture: {
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


const User = mongoose.model("User", userSchema)     // this will create a collection named 'users' in MongoDB, automatically pluralizing and lowercasing the model name is standard behavior of Mongoose/mongodb

export default User