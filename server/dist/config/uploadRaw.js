import cloudinary from "./cloudinary.js";
export const uploadRaw = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({
            folder,
            resource_type: "raw",
        }, (error, result) => {
            if (error)
                reject(error);
            else
                resolve(result);
        })
            .end(buffer);
    });
};
