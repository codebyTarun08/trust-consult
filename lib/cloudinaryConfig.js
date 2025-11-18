import cloudinary from 'cloudinary'
const v2 = cloudinary.v2;

export const cloudinaryConnect = () => {
    try {
        v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET
        });   
        //console.log("Cloudinary Configured");
    } catch (error) {
        console.error("Error configuring Cloudinary:", error);
    }
};