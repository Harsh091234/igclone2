import cloudinary from "../config/cloudinary.js";
import { uploadBase64Image } from "../config/uploadPic.js";
import User from "../models/user.model.js";

import { Request, Response } from "express";
import mongoose from "mongoose";
import { clerkClient } from "@clerk/express";
import { convertToBase64 } from "../config/convertToBase64.js";
import { CLOUDINARY_FOLDERS } from "../paths/cloudinary.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import Notification from "../models/notification.model.js";

export const syncUser = async (req: Request, res: Response) => {
  try {
    const { userId: clerkId } = req.auth!();

    if (!clerkId) return res.status(401).json({ message: "Not authenticated" });

    let clerkUser;
    try {
      clerkUser = await clerkClient.users.getUser(clerkId);
    } catch (err: any) {
      // 🔥 Clerk user deleted / not found
      if (err?.status === 404) {
        // Optional: cleanup DB user
        return res.status(401).json({
          success: false,
          user: null,
          message: "Clerk user not found",
        });
      }

      throw err; // other Clerk errors
    }

    const email = clerkUser.primaryEmailAddress?.emailAddress;

    if (!email)
      return res.status(400).json({ message: "Email not found in clerk db" });
    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({
        clerkId,
        email,
      });
    }

    return res.status(201).json({ success: true, user });
  } catch (error) {
    console.error("Error storing user:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAuthUser = async (req: Request, res: Response) => {
  try {
    const { userId: clerkId } = req.auth!();

    if (!clerkId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findOne({ clerkId })
      .populate("following", "userName fullName profilePic")
      .populate("followers", "userName fullName profilePic");

    if (!user) {
      return res.status(200).json({
        success: true,
        user: null,
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
    console.log(name);

    const user = await User.findOne({ userName: name })
      .populate("followers", "userName profilePic fullName")
      .populate("following", "userName fullName profilePic");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    console.log(user);

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
    const { userId: clerkId } = req.auth!();

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const profileComplete = user.isProfileComplete;
    const { fullName, bio, userName, gender } = req.body;

    let base64Image;
    if (req.file) {
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

      const uploaded = await uploadBase64Image(
        base64Image,
        CLOUDINARY_FOLDERS.PROFILE_PICS,
      );
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
    console.error("Error editing profile:", err);
    res.status(500).json({ message: err.message });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Query is required" });
    }

    const regex = new RegExp("^" + q, "i");

    const users = await User.find({
      $or: [
        { userName: regex },
        {
          fullName: regex,
        },
      ],
    }).select("userName profilePic fullName publicKey");

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error in searchUsers" });
  }
};

export const getSuggestedUsers = async (req: Request, res: Response) => {
  try {
    const { userId: clerkId } = req.auth!();

    const { limit } = req.query;
    if (!clerkId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const count = Number(limit) || 14;
    const suggestedUsers = await User.aggregate([
      { $match: { clerkId: { $ne: clerkId } } },
      { $sample: { size: count } },
      {
        $project: {
          userName: 1,
          fullName: 1,
          profilePic: 1,
        },
      },
    ]);

    if (suggestedUsers.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No users found",
      });
    }

    return res.status(200).json({ success: true, users: suggestedUsers });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in getSuggestedUsers",
    });
  }
};

export const followOrUnfollowUser = async (req: Request, res: Response) => {
  try {
    const { userId: clerkId } = req.auth!();

    if (!clerkId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const targetUserId = req.params.id.trim();

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const authUser = await User.findOne({ clerkId });
    const targetUser = await User.findById(targetUserId);
    if (!authUser || !targetUser) {
      return res.status(400).json({ message: "User not found" });
    }
    if (authUser._id.equals(targetUserId)) {
      return res
        .status(400)
        .json({ message: "You cannot follow/unfollow yourself" });
    }

    const isFollowing = authUser.following.some((id) =>
      id.equals(targetUserId),
    );

    if (isFollowing) {
      //unfollow
      await Promise.all([
        User.updateOne(
          { _id: authUser._id },
          { $pull: { following: targetUserId } },
        ),
        User.updateOne(
          { _id: targetUserId },
          { $pull: { followers: authUser._id } },
        ),
      ]);

      // delete notification when unfollowed
      await Notification.deleteOne({
        type: "follow",
        receiver: targetUserId,
        sender: authUser._id,
      });

      const receiverSocketId = getReceiverSocketId(targetUserId.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("notification:remove", {
          type: "follow",
          sender: authUser._id,
        });
      }

      return res.status(200).json({
        success: true,
        message: "User unfollowed successfully",
      });
    } else {
      //follow
      await Promise.all([
        User.updateOne(
          { _id: authUser._id },
          { $push: { following: targetUserId } },
        ),
        User.updateOne(
          { _id: targetUserId },
          { $push: { followers: authUser._id } },
        ),
      ]);

      // follow notification on receiver
      const notification = await Notification.create({
        receiver: targetUserId,
        sender: authUser._id,
        type: "follow",
        message: "started following you",
      });

      await notification.populate("sender", "userName profilePic");

      const receiverSocketId = getReceiverSocketId(targetUserId.toString());
      io.to(receiverSocketId).emit("notification", notification);
      return res.status(200).json({
        success: true,
        message: "User followed successfully",
      });
    }
  } catch (error: any) {
    console.log("Error in followOrUnfollowUser:", error.message);

    return res.status(500).json({
      success: false,
      message: "Error in followOrUnfollowUser",
    });
  }
};
