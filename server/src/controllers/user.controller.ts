import cloudinary from "#config/cloudinary.js";
import { uploadBase64Image } from "#config/uploadPic.js";
import User, { IUser } from "#models/user.model.js";
import { log, profile } from "console";
import { Request, Response } from "express";


export const syncUser = async(req: Request, res: Response) => {
  try {
    const {userId: clerkId} = req.auth!();


    if(!clerkId)  return res.status(401).json({ message: "Not authenticated" });
    
    const {email} = req.body;
    
    if(!email) return res.status(400).json({message: "Email is required"});
    const user = await User.findOne({clerkId})
    if (user) {
    return res.status(400).json({message: "User already exists"}); // or update if needed
}
    const newUser = await User.create({
      clerkId,
      email,
    });
  
    return res.status(201).json({ success: true, user: newUser });

    
  } catch (error) {
     console.error("Error storing user:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

export const getAuthUser = async (req: Request, res: Response) => {
  try {
     const {userId: clerkId} = req.auth!();
    
    if (!clerkId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findOne({ clerkId })
      .populate("following", "userName fullName profilePic")
      .populate("followers", "userName fullName profilePic")
      // .populate("posts"); for later

    if (!user) {
      console.log("user not present");
      
       return res.status(401).json({ message: "User not found in DB" });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("Error fetching auth user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
   
  try {
    const { userName } = req.params;
 
    if (!userName) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }
    
    const user = await User.findOne({userName})
    .populate("following", "userName fullName profilePic")
    .populate("followers", "userName fullName profilePic")
    // .populate("posts";
    
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const editProfile = async (req: Request, res: Response) => {
  try {
    const {userId: clerkId}= req.auth!();

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { fullName, bio, userName, gender, profilePic } = req.body as {
      fullName: string;
      bio: string;
      userName: string;
      gender: "male" | "female" | "other";
      profilePic: string;

    };
    
        if (!userName || userName.trim() === "") {
      return res.status(400).json({ message: "Username is required" });
    }

    
    if (!gender || !["male", "female", "other"].includes(gender)) {
      return res.status(400).json({ message: "Valid gender is required" });
    }

    user.fullName = fullName.trim();
    user.bio = bio.trim();

    user.userName = userName.toLowerCase().trim();
    user.gender = gender;


        if (profilePic) {
      // Delete old profile pic from Cloudinary if exists
      if (user.profilePicPublicId) {
        await cloudinary.uploader.destroy(user.profilePicPublicId);
      }

      // Upload new image
      const uploaded = await uploadBase64Image(profilePic, "profile_pics");

      // Save new URL and public_id
      user.profilePic = uploaded.secure_url;
      user.profilePicPublicId = uploaded.public_id;
    }


    await user.save();

    res.status(200).json({
      message: "Profile updated",
      user,
    });
  } catch (err: any) {
    console.error("Error editing profile:",err);
    res.status(500).json({ message: err.message });
  }
};