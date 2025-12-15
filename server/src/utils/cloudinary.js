import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '../config/envVars.js';


// Configuration
cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

// Upload function
const uploadOnCloudinary = async (localPath) => {

    try {
        if (!localPath) return null;
        const uploadResult = await cloudinary.uploader.upload(localPath, { resource_type: 'auto' })
        // console.log("file uploaded on cloudinary successfully")
        fs.unlinkSync(localPath);
        return uploadResult;
    }
    catch (error) {
        fs.unlinkSync(localPath);   // remove the temporarily saved file as the uploading operation got failed
        console.log("Error while uploading file on cloudinary: ", error);
        return null;
    }
}

const deleteFromCloudinary = async (imageUrl) => {
  try {
    const publicId = imageUrl.split("/").pop().split(".")[0]  // extract the ID part
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error("Cloudinary deletion error:", error)
  }
}


export { uploadOnCloudinary, deleteFromCloudinary };