import cloudinary from "./cloudinary.js";

export const uploadVideo = (buffer: Buffer, folder: string) => {
  return new Promise<any>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "video",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
};