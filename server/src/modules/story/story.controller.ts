import { CLOUDINARY_FOLDERS } from "../../paths/cloudinary.js";
import { uploadVideo } from "../../config/uploadVideo.js";
import User from "../user/user.model.js";
import { type Request, type Response } from "express";

import { convertToBase64 } from "../../config/convertToBase64.js";
import { uploadBase64Image } from "../../config/uploadPic.js";
import Story from "./story.model.js";
import Notification from "../notification/notification.model.js";
import { getReceiverSocketId, io } from "../../socket/socket.js";

export async function createStory(req: Request, res: Response) {
  try {
    const { textLayers: textLayersString } = req.body;
    let textLayers = [];

    if (textLayersString) {
      const parsed = JSON.parse(textLayersString);

      textLayers = parsed.map((layer: any) => ({
        text: layer.text,
        x: Math.max(0, Math.min(layer.x, 100)),
        y: Math.max(0, Math.min(layer.y, 100)),
        color: layer.color || "#fff",
        fontSize: layer.fontSize || 18,
      }));
    }

  
    const file = req.file;

  
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let mediaType: "image" | "video";
    let mediaUrl = "";
    let publicId = "";
    if (file.mimetype.startsWith("video")) {
      const cloudResponse = await uploadVideo(
        file.buffer,
        CLOUDINARY_FOLDERS.STORY_VIDEOS,
      );
      mediaType = "video";
      mediaUrl = cloudResponse.secure_url;
      publicId = cloudResponse.public_id;
    } else {
      const base64ImageURL = await convertToBase64(file.buffer);

      const cloudResponse = await uploadBase64Image(
        base64ImageURL,
        CLOUDINARY_FOLDERS.STORY_IMAGES,
      );
      mediaType = "image";
      mediaUrl = cloudResponse.secure_url;
      publicId = cloudResponse.public_id;
    }
    const user = await User.findById(req.user?._id)
    if (!user) {
      return res.status(400).json({ message: "No auth user found" });
    }
    console.log("user", user);

    const newStory = await Story.create({
      user: user._id,
      textLayers,
      media: {
        type: mediaType,
        url: mediaUrl,
        publicId,
      },
    });
    res
      .status(201)
      .json({ success: true, message: "Story created success", newStory });
  } catch (error: any) {
    console.log("Error in createStory", error.message);
    res.status(500).json({ message: "Error creating story", error });
  }
}

export async function getStories(req: Request, res: Response) {
  try {

       const user = await User.findById(req.user?._id)
    if (!user) {
      return res.status(400).json({ message: "No auth user found" });
    }

    const followingIds = user.following;
    const mergedIds = [...followingIds, user._id];

    // Fetch stories and populate user info
    const stories = await Story.find({
      user: { $in: mergedIds },
      expiresAt: { $gt: new Date() },
    })
      .populate("user", "userName profilePic") // populate user info
      .sort({ createdAt: -1 });

    if (!stories.length) {
      return res.status(200).json({ success: true, stories: [] });
    }

    // Group stories by user
    const groupedStories = stories.reduce(
      (acc: Array<{ user: any; stories: any[] }>, story: any) => {
        const storyObj = story.toObject();
        // Safely compute viewers count
        storyObj.viewersCount = Array.isArray(storyObj.views)
          ? storyObj.views.length
          : 0;

        // Remove views array from response if not needed
        delete storyObj.views;

        const existingUser = acc.find(
          (item) => item.user._id.toString() === storyObj.user._id.toString(),
        );

        if (existingUser) {
          existingUser.stories.push(storyObj);
        } else {
          acc.push({ user: storyObj.user, stories: [storyObj] });
        }
        return acc;
      },
      [],
    );

    res.status(200).json({ success: true, stories: groupedStories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function getSingleUserStories(req: Request, res: Response) {
  try {

   
       const user = await User.findById(req.user?._id).select("userName profilePic");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // fetch active stories (not expired)
    const stories = await Story.find({
      user,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: 1 }); // oldest first for story playback order

    if (stories.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No active stories",
        user,
        stories: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Stories found",
      user,
      stories,
    });
  } catch (error: any) {
    console.log("Error in getSingleUserStories:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server failed",
    });
  }
}

export async function viewStory(req: Request, res: Response) {
  try {
    const { storyId } = req.params;



      const user = await User.findById(req.user?._id)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }
    if (story.user.toString() === user._id.toString()) {
      return res.status(200).json({
        success: true,
        message: "Owner viewing own story",
        viewsCount: story.views.length,
      });
    }
    await Story.updateOne(
      {
        _id: storyId,
        "views.user": { $ne: user._id },
      },
      {
        $push: {
          views: {
            user: user._id,
            viewedAt: new Date(),
          },
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: "Story viewed",
      viewsCount: story.views.length,
    });
  } catch (error: any) {
    console.log("Error in viewStory:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server failed",
    });
  }
}

export async function getStoryViews(req: Request, res: Response) {
  try {
    const { storyId } = req.params;



   const user = await User.findById(req.user?._id)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const story = await Story.findById(storyId).populate(
      "views.user",
      "userName profilePic",
    );

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    // 🔐 Only story owner can see viewers
    if (story.user.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to view story viewers",
      });
    }
    const filteredViewers = story.views.filter(
      (view: any) => view.user._id.toString() !== user._id.toString(),
    );
    return res.status(200).json({
      success: true,
      viewsCount: filteredViewers.length,
      viewers: filteredViewers,
    });
  } catch (error: any) {
    console.log("Error in getStoryViews:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server failed",
    });
  }
}

export async function likeStory(req: Request, res: Response) {
  try {
    const { storyId } = req.params;
   
 
   const user = await User.findById(req.user?._id)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    const alreadyLiked = story.likes.some(
      (id) => id.toString() === user._id.toString(),
    );

    if (alreadyLiked) {
      //  UNLIKE
      story.likes = story.likes.filter(
        (id) => id.toString() !== user._id.toString(),
      );

      await story.save();

      if (story.user.toString() !== user._id.toString()) {
        await Notification.deleteOne({
          type: "like",
          sender: user._id,
          receiver: story.user._id,
          story: story._id,
        });

        const postOwnerSocketId = getReceiverSocketId(
          story.user._id.toString(),
        );
        io.to(postOwnerSocketId).emit("notification:remove", {
          type: "like",
          sender: user._id.toString(),
          story: story._id.toString(),
        });
      }
      return res.status(200).json({
        success: true,
        message: "Story unliked",
        liked: false,
        likesCount: story.likes.length,
      });
    } else {
      //  LIKE
      story.likes.push(user._id);

      await story.save();
      //realtime notification
      if (story.user.toString() !== user._id.toString()) {
        const notification = await Notification.create({
          receiver: story.user._id,
          sender: user._id,
          type: "like",
          message: "liked your story",
          story: story._id,
        });
        await notification.populate([
          {
            path: "sender",
            select: "userName profilePic",
          },
          {
            path: "story",
            select: "media",
          },
        ]);
        const receiverSocketId = getReceiverSocketId(story.user._id.toString());

        io.to(receiverSocketId).emit("notification", notification);
      }

      return res.status(200).json({
        success: true,
        message: "Story liked",
        liked: true,
        likesCount: story.likes.length,
      });
    }
  } catch (error: any) {
    console.log("Error in likeStory:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server failed",
    });
  }
}

export async function deleteStory(req: Request, res: Response) {
  try {
  
    const { storyId } = req.params;
       const user = await User.findById(req.user?._id)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    // 🔐 Only owner can delete
    if (story.user.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete this story",
      });
    }

    await story.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Story deleted successfully",
    });
  } catch (error: any) {
    console.log("Error in deleteStory:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server failed",
    });
  }
}
