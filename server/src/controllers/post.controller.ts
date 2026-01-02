import { uploadBase64Image } from "#config/uploadPic.js";
import { uploadVideo } from "#config/uploadVideo.js";
import Post from "#models/post.model.js";
import User from "#models/user.model.js";
import { CLOUDINARY_FOLDERS } from "#paths/cloudinary.js";
import { Request, Response } from "express";

import sharp from "sharp";

export const createPost = async(req: Request, res: Response) => {
  try {
    // const {userId: clerkId} = req.auth!(); 
    const { caption, clerkId} = req.body as {
      clerkId: string,
      caption?: string
    };
    const authUser = await User.findOne({clerkId});
    if(!authUser) return res.status(401).json({message: "No auth user found"});
    const files = req.files as Express.Multer.File[]; 

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Media is required" });
    };
    
    const media = [];
    for(const file of files){
      const isVideo = file.mimetype.startsWith("video");
      
      if(isVideo){
         const cloudResponse = await uploadVideo(file.buffer, CLOUDINARY_FOLDERS.POST_VIDEOS);

         
        media.push({
          url: cloudResponse.secure_url,
          publicId: cloudResponse.public_id,
          type: "video",
        });
        continue;
      }

     const optimizedBuffer = await sharp(file.buffer)
        .resize({ width: 800, height: 800, fit: "inside" })
        .jpeg({ quality: 80 })
        .toBuffer();

      // 🔹 convert to base64
      const base64Image = `data:image/jpeg;base64,${optimizedBuffer.toString(
        "base64"
      )}`;

      // 🔹 upload to cloudinary
      const cloudResponse = await uploadBase64Image(
        base64Image,
       CLOUDINARY_FOLDERS.POST_IMAGES );

        media.push({
          url: cloudResponse.secure_url,
          publicId: cloudResponse.public_id,
          type: "image",
        });
    }
    
   
    
    const post =  new Post({
      caption,
      author: authUser?._id,
      media 
    });
    await post.save();


    authUser.posts.push(post._id);
    await authUser.save();

    await post.populate({path: "author", select: "userName fullName profilePic"});

    return res.status(200).json({success: true, message:"Post created success", post, })



  } catch (error: any) {
    console.log("Error in createPost:", error.message)

    return res.status(500).json({
      success: false,
      message: "Error in createPost",
    });
  }
}

