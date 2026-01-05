import cloudinary from "#config/cloudinary.js";
import { uploadBase64Image } from "#config/uploadPic.js";
import User, { IUser } from "#models/user.model.js";
import { log, profile } from "console";
import { Request, Response } from "express";
import mongoose from "mongoose";
import {clerkClient} from "@clerk/express"
import { convertToBase64 } from "#config/convertToBase64.js";
import { CLOUDINARY_FOLDERS } from "#paths/cloudinary.js";

export const syncUser = async(req: Request, res: Response) => {
  try {
    const {userId: clerkId} = req.auth!();


    if(!clerkId)  return res.status(401).json({ message: "Not authenticated" });
    
    const clerkUser = await clerkClient.users.getUser(clerkId);

    const email = clerkUser.primaryEmailAddress?.emailAddress;
    
    if(!email) return res.status(400).json({message: "Email not found in clerk db"});
    const user = await User.findOne({clerkId})
    console.log("id", clerkId)
    console.log("user", user)
    if (user) {
    return res.status(405).json({message: "User already exists"}); // or update if needed
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
      

    if (!user) {
    
      return res.status(200).json({
        message: "Auth user not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("Error in getAuthUser", error);
    return res.status(500).json({ message: "Error in getAuthUser" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  
  try {
    const { name } = req.params;
    console.log(name)
  //   const regex = new RegExp("^" + name, "i");
    
  //   const users = await User.find({
  //     $or: [
  //       {userName: {$regex: regex}},

  //     {fullName: {$regex: regex}}]
      
      
  // },
  //   )
  //   .populate("following", "userName fullName profilePic") 
  //   .populate("followers", "userName fullName profilePic")
  //   // .populate("posts";

  const user = await User.findOne({userName: name});
   if(!user) return res.status(400).json({success:false, message:"User not found"});
    console.log(user)
 

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

    const profileComplete = user.isProfileComplete;
    const { fullName, bio, userName, gender} = req.body;
    
   let base64Image;
   if(req.file){
    base64Image = await convertToBase64(req.file.buffer);
   }


   
        

    user.fullName = fullName.trim();
    user.bio = bio.trim();

    user.userName = userName.toLowerCase().trim();
    user.gender = gender;

if (base64Image) {
  if (user.profilePicPublicId) {
    await cloudinary.uploader.destroy(user.profilePicPublicId);
  }

  const uploaded = await uploadBase64Image(base64Image, CLOUDINARY_FOLDERS.PROFILE_PICS);
  user.profilePic = uploaded.secure_url;
  user.profilePicPublicId = uploaded.public_id;
}
    if (!profileComplete) user.isProfileComplete = true;

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

export const searchUsers = async(req: Request, res: Response) => {
  try {
    const {q} = req.query;
    if(!q || typeof q !== "string"){
          return res.status(400).json({ success: false, message: "Query is required" });
    }

    const regex = new RegExp("^" + q, "i");

    const users = await User.find({
      $or: [
        {username: regex},
        {
          fullName: regex, 
        }
      ]
    }).select("userName profilePic fullName");

    if(!users) return res.status(200).json({message:"No users found"});

        res.json({ success: true, users });

  } catch (error) {
      res.status(500).json({ success: false, message: "Error in searchUsers" });
  }
}

export const getSuggestedUsers = async(req: Request, res: Response) => {
  try {
    const {userId: clerkId} = req.auth!();
    
    
    if (!clerkId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const suggestedUsers = await User.find({clerkId: {$ne: clerkId}  }).select("userName fullName profilePic");

   
    if (suggestedUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }




    return res.status(200).json({success: true, suggestedUsers})

  } catch (error) {
    

    return res.status(500).json({
      success: false,
      message: "Error in getSuggestedUsers",
    });
  }
}

export const followOrUnfollowUser = async(req: Request, res: Response) => {
  try {
    const {userId: clerkId} = req.auth!();
   
    if (!clerkId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const targetUserId = req.params.id.trim();
  

if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
  return res.status(400).json({ message: "Invalid user id" });
}
    

    const authUser = await User.findOne({clerkId});
    const targetUser = await User.findById(targetUserId);
    if(!authUser || !targetUser){
       return res.status(400).json({ message: "User not found" });
    }
 if (authUser._id.equals(targetUserId)) {
      return res
        .status(400)
        .json({ message: "You cannot follow/unfollow yourself" });
    }
    
  const isFollowing = authUser.following.some(
      (id) => id.equals(targetUserId)
    );

    
    if(isFollowing){
      //unfollow
      await Promise.all([
        User.updateOne({_id: authUser._id},{$pull: {following: targetUserId}} ),
        User.updateOne({_id: targetUserId}, {$pull: {followers: authUser._id}})
      ]);

      return res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
    });
    }
    else{
      //follow
      await Promise.all([
        User.updateOne({_id: authUser._id},{$push: {following: targetUserId}} ),
        User.updateOne({_id: targetUserId}, {$push: {followers: authUser._id}})
      ]);
      
     return res.status(200).json({
      success: true,
      message: "User followed successfully",
    });
    }
  } catch (error: any) {
    console.log("Error in followOrUnfollowUser:", error.message)

    return res.status(500).json({
      success: false,
      message: "Error in followOrUnfollowUser",
    });
  }
}


