import { getReceiverSocketId, io } from "../../socket/socket.js";
import { uploadBase64Image } from "../../config/uploadPic.js";
import { uploadVideo } from "../../config/uploadVideo.js";
import Comment from "./comment.model.js";
import Post from "./post.model.js";
import fs from "fs";
import User from "../user/user.model.js";
import path from "path";
import { CLOUDINARY_FOLDERS } from "../../paths/cloudinary.js";
import { Request, Response } from "express";
import sharp from "sharp";
import Notification from "../notification/notification.model.js";
import { deleteCache, getCache, setCache } from "../../config/cache.js";
import redis from "../../config/redis.js";
import { cropVideo, getVideoDimensions } from "../../config/ffmpeg.js";
import { uploadOnCloudinary } from "@/config/cloudinary.js";


export const createPost = async (req: Request, res: Response) => {
  try {
    const { caption, isReel, feedRatio, aspect} = req.body;
    

    const authUser = await User.findById(req.user?._id);
    if (!authUser) {
      return res.status(401).json({ message: "No auth user found" });
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Media is required" });
    }

   let crops: any[] = [];

try {
  const raw = req.body.cropData;

  if (Array.isArray(raw)) {
    crops = raw.map((c) => JSON.parse(c));
  } else if (raw) {
    crops = [JSON.parse(raw)];
  }
} catch (err) {
  console.log("Crop parse error:", err);
  crops = [];
}
    const media = await Promise.all(
      files.map(async (file, index) => {
        const isVideo = file.mimetype.startsWith("video");
  const cropItem = crops.find((c) => c.index === index);
  const crop = cropItem?.crop || null;
 
        // =========================
        // 🎬 VIDEO HANDLING (SAFE)
        // =========================
     if (isVideo) {
       const inputPath = file.path;
      const videoSize = await getVideoDimensions(file.path);
       const outputPath = path.join(
         "uploads",
         `cropped-${Date.now()}-${Math.random().toString(36).slice(2)}.mp4`,
       );

       let scaledCrop: any = null;
   

   
      if (crop) {
        const x = Math.max(0, Math.floor(crop.x));
        const y = Math.max(0, Math.floor(crop.y));

        let width = Math.floor(crop.width);
        let height = Math.floor(crop.height);

        // 👇 USE REAL VIDEO SIZE HERE
        width = Math.min(width, videoSize.width - x);
        height = Math.min(height, videoSize.height - y);

        if (width <= 0 || height <= 0) {
          throw new Error("Invalid crop");
        }

        scaledCrop = { x, y, width, height };
      }
       // 🔥 SAFE FFmpeg CALL
       await cropVideo(inputPath, outputPath, scaledCrop);

       const cloudResponse = await uploadOnCloudinary(outputPath, CLOUDINARY_FOLDERS.POST_VIDEOS)
      //  const cloudResponse = await uploadVideo(
      //    fs.readFileSync(outputPath),
      //    CLOUDINARY_FOLDERS.POST_VIDEOS,
      //  );

     

if (!cloudResponse) {
  throw new Error("Cloudinary upload failed");
}
       return {
         url: cloudResponse.secure_url,
         publicId: cloudResponse.public_id,
         type: "video",
         isReel: isReel === "true",
         feedRatio,
         aspect,
         width: cloudResponse.width,
         height: cloudResponse.height,
         aspectRatio: cloudResponse.width / cloudResponse.height,
       };
     }
        // =========================
        // 🖼️ IMAGE HANDLING (FIXED)
        // =========================
        const image = sharp(file.path);
        const metadata = await image.metadata();

        let croppedBuffer: Buffer;

        if (
          crop &&
          metadata.width &&
          metadata.height &&
          crop.width > 0 &&
          crop.height > 0
        ) {
          const left = Math.max(0, Math.round(crop.x));
          const top = Math.max(0, Math.round(crop.y));

          let width = Math.round(crop.width);
          let height = Math.round(crop.height);

          // clamp inside image bounds
          width = Math.min(width, metadata.width - left);
          height = Math.min(height, metadata.height - top);

          if (width <= 0 || height <= 0) {
            throw new Error("Invalid crop area");
          }

          croppedBuffer = await image
            .extract({
              left,
              top,
              width,
              height,
            })
            .resize({ width: 1080 })
            .jpeg({ quality: 85 })
            .toBuffer();
        } else {
          croppedBuffer = await image
            .resize({ width: 1080 })
            .jpeg({ quality: 85 })
            .toBuffer();
        }

        const finalMeta = await sharp(croppedBuffer).metadata();

        const aspectRatio =
          (finalMeta.width || 1) / (finalMeta.height || 1);

        const base64Image = `data:image/jpeg;base64,${croppedBuffer.toString(
          "base64"
        )}`;

        const cloudResponse = await uploadBase64Image(
          base64Image,
          CLOUDINARY_FOLDERS.POST_IMAGES
        );

        
if (!cloudResponse) {
  throw new Error("Cloudinary upload failed");
}

        return {
          url: cloudResponse.secure_url,
          publicId: cloudResponse.public_id,
          type: "image",
          height: finalMeta.height,
          width: finalMeta.width,
          aspectRatio,
          aspect,
          isReel: isReel === "true",
          feedRatio: feedRatio || "4/5",
        };
      })
    );

    const post = new Post({
      caption,
      author: authUser._id,
      media,
    });

    await post.save();

    authUser.posts.push(post._id);
    await authUser.save();

    await post.populate({
      path: "author",
      select: "userName fullName profilePic",
    });

   

    return res.status(200).json({
      success: true,
      message: "Post created success",
      post,
    });
  } catch (error: any) {
    console.log("Error in createPost:", error.message);

    return res.status(500).json({
      success: false,
      message: "Error in createPost",
    });
  }
};

export const toggleLikePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; //post id
    
    const authUser = await User.findById(req.user?._id);
    if (!authUser)
      return res.status(401).json({
        success: false,
        message: "Auth user not found",
      });

    const post = await Post.findById(id);
    if (!post)
      return res.status(400).json({
        success: false,
        message: "No post found",
      });
    const isLiked = post.likes.some(
      (id) => id.toString() === authUser._id.toString(),
    );

    if (isLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== authUser._id.toString(),
      );
      await post.save();

      // 🔔 realtime notification (optional)
      // notifyPostOwner(post.author, authUser._id, "like")
      if (post.author._id.toString() !== authUser._id.toString()) {
        await Notification.deleteOne({
          type: "like",
          sender: authUser._id,
          receiver: post.author,
          post: post._id,
        });

        const postOwnerSocketId = getReceiverSocketId(
          post.author._id.toString(),
        );
        io.to(postOwnerSocketId).emit("notification:remove", {
          type: "like",
          sender: authUser._id.toString(),
          post: post._id.toString(),
        });
      }

      return res.status(200).json({
        success: true,
        message: "Post unliked successfully",
        post,
      });
    } else {
      post.likes.push(authUser._id);
      await post.save();

      // 🔔 realtime notification (optional)
      // notifyPostOwner(post.author, authUser._id, "like")
      if (post.author._id.toString() !== authUser._id.toString()) {
        const notification = await Notification.create({
          receiver: post.author._id,
          sender: authUser._id,
          type: "like",
          post: post._id,
          message: "liked your post",
        });

        await notification.populate([
          {
            path: "sender",
            select: "userName profilePic",
          },
          {
            path: "post",
            select: "media",
          },
        ]);

        const postOwnerSocketId = getReceiverSocketId(
          post.author._id.toString(),
        );
        io.to(postOwnerSocketId).emit("notification", notification);
      }

      return res.status(200).json({
        success: true,
        message: "Post liked successfully",
        post,
      });
    }
  } catch (error: any) {
    console.log("Error in toggleLikePost:", error.message);

    return res.status(500).json({
      success: false,
      message: "Error in toggleLikePost",
    });
  }
};

export const commentPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; //post id
    const { text } = req.body;

    const authUser = await User.findById(req.user?._id);
    if (!authUser)
      return res.status(401).json({
        success: false,
        message: "Auth user not found",
      });

    const comment = await Comment.create({
      post: id.toString(),
      author: authUser._id,
      text,
    });

    await comment.populate({
      path: "author",
      select: "userName fullName profilePic",
    });

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.comments.push(comment._id);
    await post.save();

    // 🔔 COMMENT NOTIFICATION
    if (authUser._id.toString() !== post.author._id.toString()) {
      const notification = await Notification.create({
        receiver: post.author._id,
        sender: authUser._id,
        type: "comment",
        post: post._id,
        comment: comment._id,
        message: "commented on your post",
      });
      await notification.populate([
        {
          path: "sender",
          select: "userName profilePic",
        },
        {
          path: "post",
          select: "media",
        },
        {
          path: "comment",
          select: "text",
        },
      ]);

      const postOwnerSocketId = getReceiverSocketId(post.author._id.toString());
      io.to(postOwnerSocketId).emit("notification", notification);
    }

    return res.status(200).json({
      success: true,
      message: "Commented  successfully",
      comment,
      post,
    });
  } catch (error: any) {
    console.log("Error in commentPost:", error.message);

    return res.status(500).json({
      success: false,
      message: "Error in commentPost",
    });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id: commentId } = req.params;

    const authUser = await User.findById(req.user?._id);
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "Auth user not found",
      });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Find post
    const post = await Post.findById(comment.post);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Comment author OR post owner can delete
    const isCommentAuthor =
      comment.author.toString() === authUser._id.toString();
    const isPostOwner = post.author.toString() === authUser._id.toString();

    if (!isCommentAuthor && !isPostOwner) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
    }

    post.comments = post.comments.filter((c) => c.toString() !== commentId);
    await post.save();

    await Comment.findByIdAndDelete(commentId);

    await Notification.deleteMany({
      type: "comment",
      comment: commentId,
    });

    // 🔴 Optional: realtime update
    const postOwnerSocketId = getReceiverSocketId(post.author.toString());
    if (postOwnerSocketId) {
      io.to(postOwnerSocketId).emit("notification:remove", {
        comment: comment._id.toString(),
        type: "comment",
        post: post._id.toString(),
        sender: authUser._id.toString(),
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      commentId,
    });
  } catch (error: any) {
    console.error("Error in deleteComment:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error in deleteComment",
    });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; //post id

    const authUser = await User.findById(req.user?._id);

    if (!authUser)
      return res.status(401).json({
        message: "No auth user found",
      });

    const post = await Post.findById(id);
    if (!post)
      return res.status(401).json({
        message: "No post found",
      });

    if (post.author._id.toString() !== authUser._id.toString())
      return res.status(403).json({
        message: "Unauthorized",
      });

    await Promise.all([
      post.deleteOne(),
      Comment.deleteMany({ post: id }),
      authUser.updateOne({
        $pull: { posts: id },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "post is deleted",
    });
  } catch (error: any) {
    console.log("Error in deletePost:", error.message);

    return res.status(500).json({
      success: false,
      message: "Error in deletePost",
    });
  }
};

export const toggleBookmarkPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; //post id

    const post = await Post.findById(id);
    if (!post)
      return res.status(401).json({
        message: "No post found",
      });

    const authUser = await User.findById(req.user?._id);
    if (!authUser)
      return res.status(401).json({
        message: "No auth user found",
      });

    const isBookmarked = authUser.bookmarks.some(
      (bookmarkId) => bookmarkId.toString() === id,
    );

    if (isBookmarked) {
      //remove bookmark
      await authUser.updateOne({ $pull: { bookmarks: post._id } });
      return res.status(200).json({
        success: true,
        message: "post is unbookmarked",
      });
    } else {
      //bookmark
      await authUser.updateOne({ $addToSet: { bookmarks: post._id } });
      return res.status(200).json({
        success: true,
        message: "post is bookmarked",
      });
    }
  } catch (error: any) {
    console.log("Error in bookmarkPost:", error.message);

    return res.status(500).json({
      success: false,
      message: "Error in bookmarkPost",
    });
  }
};

//get post + top 2 comments
export const getAllPosts = async (req: Request, res: Response) => {
  try {
 
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // latest posts first  
      .populate({ path: "author", select: "userName profilePic" })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 }, limit: 2 }, // latest comments first
        populate: {
          path: "author",
          select: "userName profilePic",
        },
      })
      .lean();

   

    if (posts.length === 0)
      return res.status(200).json({
        success: true,
        posts: [],
        message: "No posts found",
      });

    // if author deletes from db then its posts gets deleted

    const validPosts = posts
      .filter((post) => post.author) // ✅ remove posts without author
      .map((post) => ({
        ...post,
        comments: post.comments?.filter((comment: any) => comment.author),
      }));

    return res.status(200).json({
      success: true,
      posts: validPosts,
    
    });
  } catch (error: any) {
    console.log("Error in getAllPosts:", error.message);

    return res.status(500).json({
      success: false,
      message: "Error in getAllPosts",
    });
  }
};

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id is required",
      });
    }

    

    

    const posts = await Post.find({ author: id })
      .sort({ createdAt: -1 })
    
      .populate({
        path: "author",
        select: "userName profilePic",
      })
      .lean();

    const totalPosts = await Post.countDocuments({ author: id });

    return res.status(200).json({
      success: true,
      posts,
     
    });
  } catch (error: any) {
    console.log("Error in getUserPosts:", error.message);

    return res.status(500).json({
      success: false,
      message: "Error in getUserPosts",
    });
  }
};

export const getUserReels = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const reels = await Post.find({
      author: id,
      media: { $size: 1 },
      "media.type": "video",
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "userName profilePic followers",
      })
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "userName profilePic",
        },
      })
      .lean();

    const validReels = reels
      .filter((reel) => reel.author)
      .map((reel) => ({
        ...reel,
        comments: reel.comments?.filter((c: any) => c.author) ?? [],
      }));

    return res.status(200).json({
      success: true,
      posts: validReels,
    });
  } catch (error) {
    console.error("getUserReels error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//get all comments when user clicks show more...
export const getAllComments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; //post id

    const comments = await Comment.find({ post: id }).populate(
      "author",
      "userName profilePic",
    );
    if (comments.length === 0)
      return res.status(200).json({
        success: true,
        comments: [],
        message: "No comments found",
      });

    const validComments = comments.filter((comment) => comment.author);

    return res.status(200).json({
      success: true,
      comments: validComments,
    });
  } catch (error: any) {
    console.log("Error in getAllComments:", error.message);

    return res.status(500).json({
      success: false,
      message: "Error in getAllComments",
    });
  }
};
export const getAllReels = async (req: Request, res: Response) => {
  try {
    const reels = await Post.find({
      media: { $size: 1 },
      "media.type": "video",
    })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "userName profilePic followers" })
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "userName profilePic",
        },
      })
      .lean();

    if (reels.length === 0) {
      return res.status(200).json({
        success: true,
        posts: [],
        message: "No reels present",
      });
    }
    

   const validReels = reels
     .filter((reel) => reel.author)
     .map((reel) => {
       const validComments = reel.comments?.filter((c: any) => c.author) || [];

       return {
         ...reel,
         comments: validComments,
       };
     });

    if (validReels.length === 0) {
      return res.status(200).json({
        success: true,
        posts: [],
        message: "No valid reels",
      });
    }
      console.log("reels in bkd", validReels);
    return res.status(200).json({
      success: true,
      posts: validReels,
    });
  } catch (error: any) {
    console.log("Error in getAllReels:", error);

    return res.status(500).json({
      success: false,
      message: "Error in getAllReels",
    });
  }
};
