import cloudinary from "./cloudinary.js";
export const uploadVideo = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
            folder,
            resource_type: "video",
        }, (error, result) => {
            if (error)
                reject(error);
            else
                resolve(result);
        }).end(buffer);
    });
};
