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
import { cropVideo } from "../../config/ffmpeg.js";

type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function sanitizeCrop(crop: any, videoW: number, videoH: number) {
  const x = Math.max(0, Math.floor(crop.x));
  const y = Math.max(0, Math.floor(crop.y));
  const w = Math.floor(crop.width);
  const h = Math.floor(crop.height);

  const safeW = Math.min(w, videoW - x);
  const safeH = Math.min(h, videoH - y);

  if (safeW <= 0 || safeH <= 0) {
    throw new Error("Invalid crop after sanitization");
  }

  return {
    x,
    y,
    width: safeW,
    height: safeH,
  };
}

export const createPost = async (req: Request, res: Response) => {
  try {
    const { caption, isReel, feedRatio, cropData, originalWidth, originalHeight, mediaWidth, mediaHeight } = req.body;
    console.log("req.body", req.body)

    const authUser = await User.findById(req.user?._id);
    if (!authUser) {
      return res.status(401).json({ message: "No auth user found" });
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Media is required" });
    }

    let crop = null;
    try {
      crop = cropData ? JSON.parse(cropData) : null;
    } catch {
      crop = null;
    }

    const media = await Promise.all(
      files.map(async (file) => {
        const isVideo = file.mimetype.startsWith("video");

        // =========================
        // 🎬 VIDEO HANDLING (SAFE)
        // =========================
     if (isVideo) {
       const inputPath = file.path;

       const outputPath = path.join(
         "uploads",
         `cropped-${Date.now()}-${Math.random().toString(36).slice(2)}.mp4`,
       );

       let scaledCrop: any = null;

       if (
         crop &&
         originalWidth &&
         originalHeight &&
         mediaWidth &&
         mediaHeight
       ) {
         const oW = Number(originalWidth);
         const oH = Number(originalHeight);
         const mW = Number(mediaWidth);
         const mH = Number(mediaHeight);

         if (!oW || !oH || !mW || !mH) {
           throw new Error("Invalid dimensions");
         }

         // 🔥 SAFE SCALE
         const scaleX = oW / mW;
         const scaleY = oH / mH;

         const rawCrop = {
           x: crop.x * scaleX,
           y: crop.y * scaleY,
           width: crop.width * scaleX,
           height: crop.height * scaleY,
         };

         // 🔥 CLAMP (CRITICAL FIX)
         const x = Math.max(0, Math.floor(rawCrop.x));
         const y = Math.max(0, Math.floor(rawCrop.y));

         let width = Math.floor(rawCrop.width);
         let height = Math.floor(rawCrop.height);

         width = Math.min(width, oW - x);
         height = Math.min(height, oH - y);

         // ❗ FINAL VALIDATION
         if (width <= 0 || height <= 0) {
           throw new Error("Invalid crop after scaling");
         }

         scaledCrop = { x, y, width, height };
       }

       // 🔥 SAFE FFmpeg CALL
       await cropVideo(inputPath, outputPath, scaledCrop);

       const cloudResponse = await uploadVideo(
         fs.readFileSync(outputPath),
         CLOUDINARY_FOLDERS.POST_VIDEOS,
       );

       fs.unlinkSync(outputPath);
       fs.unlinkSync(inputPath);

       return {
         url: cloudResponse.secure_url,
         publicId: cloudResponse.public_id,
         type: "video",
         isReel: isReel === "true",
         feedRatio,
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

        fs.unlinkSync(file.path);

        return {
          url: cloudResponse.secure_url,
          publicId: cloudResponse.public_id,
          type: "image",
          height: finalMeta.height,
          width: finalMeta.width,
          aspectRatio,
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

    await deleteCache(`igclone2_user_posts:${authUser._id}:*`);

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
      post: id,
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
    const MAX_PAGE = 99;
    const page = Math.min(MAX_PAGE, Math.max(1, Number(req.query.page) || 1)); //values > 0  and < 99
    const MAX_LIMIT = 5;
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(5, Number(req.query.limit) || 5),
    ); // values 2>=  and <= 5;
    const skip = (page - 1) * limit;
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // latest posts first
      .skip(skip)
      .limit(limit)
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

    const totalPosts = await Post.countDocuments();

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

    console.log(validPosts);
    return res.status(200).json({
      success: true,
      posts: validPosts,
      hasMore: skip + validPosts.length < totalPosts,
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
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ success: false, message: "id is undefined" });
  const MAX_PAGE = 99;
  const page = Math.min(MAX_PAGE, Math.max(1, Number(req.query.page) || 1)); //values > 0  and < 99
  const MAX_LIMIT = 15;
  const limit = Math.min(MAX_LIMIT, Math.max(5, Number(req.query.limit) || 10)); // values >=5  and <= 15;

  const cacheKey = `igclone2_user_posts:${id}:page:${page}:limit:${limit}`;
  const lockKey = `lock:${cacheKey}`;

  let lockAcquired = false;

  try {
    const skip = (page - 1) * limit;
    const cached = await getCache(cacheKey);

    if (cached) {
      console.log("Serving from redis");
      const parsed = typeof cached === "string" ? JSON.parse(cached) : cached;
      return res.json({
        success: true,
        posts: parsed.posts,
        hasMore: parsed.hasMore,
      });
    }

    // 🔒 Acquire lock
    const lock =
      process.env.NODE_ENV === "production"
        ? await redis.set(lockKey, "locked", { nx: true, ex: 10 })
        : await redis.set(lockKey, "locked", { NX: true, EX: 10 });

    if (lock) {
      lockAcquired = true;
    }

    //  If lock NOT acquired → wait
    if (!lock) {
      let retries = 10;

      while (retries--) {
        await new Promise((res) => setTimeout(res, 2000));

        const cachedRetry = await getCache(cacheKey);
        if (cachedRetry) {
          console.log(`[${id}] ⚡ Cache found during wait! Returning...`);
          return res.json({
            success: true,
            posts:
              typeof cachedRetry === "string"
                ? JSON.parse(cachedRetry)
                : cachedRetry,
          });
        }
      }

      console.log(`[${id}] 💥 Fallback to DB after waiting`);
    }

    // 🔥 DB call (only one request ideally)
    const posts = await Post.find({ author: id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: "author", select: "userName profilePic" })
      .lean();

    const totalPosts = await Post.countDocuments({ author: id });
    if (posts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No posts found",
        hasMore: false,
      });
    }

    const response = {
      posts,
      hasMore: skip + posts.length < totalPosts,
    };

    await setCache(cacheKey, response, 180);

    return res.status(200).json({
      success: true,
      posts,
      hasMore: skip + posts.length < totalPosts,
    });
  } catch (error: any) {
    console.log("Error in getUserPosts:", error.message);

    return res.status(500).json({
      success: false,
      message: "Error in getUserPosts",
    });
  } finally {
    // 🔓 Release lock (CRITICAL)
    if (lockAcquired) {
      await redis.del(lockKey);
    }
  }
};

export const getUserReels = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // user id
    const MAX_PAGE = 99;
    const page = Math.min(MAX_PAGE, Math.max(1, Number(req.query.page) || 1)); //values > 0  and < 99
    const MAX_LIMIT = 15;
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(5, Number(req.query.limit) || 10),
    ); // values >=5  and <= 15;

    const skip = (page - 1) * limit;

    // 🔥 ONLY VIDEO POSTS
    const reels = await Post.find({
      author: id,
      "media.type": "video",
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: "author", select: "userName profilePic" })
      .lean();

    const total = await Post.countDocuments({
      author: id,
      "media.type": "video",
    });

    res.status(200).json({
      reels,
      hasMore: skip + reels.length < total,
    });
  } catch (error) {
    console.error("getUserReels error:", error);
    res.status(500).json({ message: "Server error" });
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
        videos: [],
        message: "No reels present",
      });
    }

    const validReels = reels
      .filter((reel) => reel.author) // remove deleted authors
      .map((reel) => {
        const validComments = reel.comments?.filter((c: any) => c.author) || [];

        return {
          _id: reel._id,
          caption: reel.caption,
          createdAt: reel.createdAt,

          video: {
            url: reel.media[0].url,
            publicId: reel.media[0].publicId,
          },

          author: reel.author,
          likes: reel.likes,

          // (optional) send filtered comments too
          comments: validComments,
        };
      });

    if (validReels.length === 0) {
      return res.status(200).json({
        success: true,
        videos: [],
        message: "No valid reels",
      });
    }

    return res.status(200).json({
      success: true,
      videos: validReels,
    });
  } catch (error: any) {
    console.log("Error in getAllReels:", error);

    return res.status(500).json({
      success: false,
      message: "Error in getAllReels",
    });
  }
};
