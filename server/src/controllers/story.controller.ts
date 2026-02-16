import { CLOUDINARY_FOLDERS } from "../paths/cloudinary.js";
import { uploadVideo } from "../config/uploadVideo.js";
import User from "../models/user.model.js";
import { type Request, type Response } from "express";
import sharp from "sharp";
import { convertToBase64 } from "../config/convertToBase64.js";
import { uploadBase64Image } from "../config/uploadPic.js";
import Story from "../models/story.model.js";

export async function createStory(req: Request, res: Response) {
  try {
     const { text } = req.body;
    const { userId: clerkId } = req.body;
        // const { userId: clerkId } = req.auth!() ;
    const file = req.file;

    if (!clerkId) return res.status(401).json({ message: "Unauthenticated" });
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let mediaType :"image" | "video";
    let mediaUrl="";
    let publicId = "";
    if(file.mimetype.startsWith("video")){
        const cloudResponse = await uploadVideo(file.buffer, CLOUDINARY_FOLDERS.STORY_VIDEOS);
        mediaType = "video";
        mediaUrl = cloudResponse.secure_url;
        publicId = cloudResponse.public_id;
    }
    else{
        const base64ImageURL = await convertToBase64(file.buffer);
            
        const cloudResponse = await uploadBase64Image(base64ImageURL, CLOUDINARY_FOLDERS.STORY_IMAGES);
   mediaType = "image";
    mediaUrl = cloudResponse.secure_url;
    publicId = cloudResponse.public_id;

    }


    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(400).json({ message: "No auth user found" });
    }
    console.log("user", user);

    const newStory = await Story.create({
      user: user._id,
      text,
      media: {
        type: mediaType,
        url: mediaUrl,
        publicId
      },
     
    });
 res.status(201).json({success: true, message: "Story created success", newStory});
  } catch (error: any) { 
    console.log("Error in createStory", error.message);
    res.status(500).json({ message: "Error creating story", error });}
}
