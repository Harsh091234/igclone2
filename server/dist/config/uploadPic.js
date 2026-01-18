import cloudinary from "./cloudinary.js";
export const uploadBase64Image = async (base64String, folder) => {
    try {
        const result = await cloudinary.uploader.upload(base64String, {
            folder,
            resource_type: "image",
        });
        return result;
    }
    catch (err) {
        throw err;
    }
};
