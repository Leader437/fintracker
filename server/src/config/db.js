import mongoose from 'mongoose'
import { MONGO_URI } from './envVars.js'

const connectDB = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(`${MONGO_URI}`);
        console.log("Connected to MongoDB!!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit process with failure           // Added to ensure the application exits if DB connection fails, process is built In Node.js
    }
}

export default connectDB;