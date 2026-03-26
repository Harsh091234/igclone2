import { getReceiverSocketId, io } from "../socket/socket.js";
import { uploadBase64Image } from "../config/uploadPic.js";
import { uploadVideo } from "../config/uploadVideo.js";

import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { CLOUDINARY_FOLDERS } from "../paths/cloudinary.js";
import { Request, Response } from "express";

import sharp from "sharp";
import Notification from "../models/notification.model.js";
import { deleteCache, getCache, setCache } from "../config/cache.js";
import redis from "../config/redis.js";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { userId: clerkId } = req.auth!();
    const { caption } = req.body;
    console.log("ji");
    const authUser = await User.findOne({ clerkId });
    if (!authUser)
      return res.status(401).json({ message: "No auth user found" });
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Media is required" });
    }

    const media = await Promise.all(
      files.map(async (file) => {
        const isVideo = file.mimetype.startsWith("video");

        if (isVideo) {
          const cloudResponse = await uploadVideo(
            file.buffer,
            CLOUDINARY_FOLDERS.POST_VIDEOS,
          );

          return {
            url: cloudResponse.secure_url,
            publicId: cloudResponse.public_id,
            type: "video",
          };
        }

        const optimizedBuffer = await sharp(file.buffer)
          .resize({ width: 800, height: 800, fit: "inside" })
          .jpeg({ quality: 80 })
          .toBuffer();

        const base64Image = `data:image/jpeg;base64,${optimizedBuffer.toString("base64")}`;

        const cloudResponse = await uploadBase64Image(
          base64Image,
          CLOUDINARY_FOLDERS.POST_IMAGES,
        );

        return {
          url: cloudResponse.secure_url,
          publicId: cloudResponse.public_id,
          type: "image",
        };
      }),
    );
    const post = new Post({
      caption,
      author: authUser?._id,
      media,
    });
    await post.save();

    authUser.posts.push(post._id);
    await authUser.save();

    await post.populate({
      path: "author",
      select: "userName fullName profilePic",
    });

    await deleteCache(`igclone2_user_posts:${authUser._id}`);

    return res
      .status(200)
      .json({ success: true, message: "Post created success", post });
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
    const { userId: clerkId } = req.auth!();
    const { id } = req.params; //post id

    const authUser = await User.findOne({ clerkId });
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
    const { userId: clerkId } = req.auth!();
    const { id } = req.params; //post id
    const { text } = req.body;

    const authUser = await User.findOne({ clerkId });
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
    const { userId: clerkId } = req.auth!();
    const { id: commentId } = req.params;

    // Auth user
    const authUser = await User.findOne({ clerkId });
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
      });

    if (!posts)
      return res.status(400).json({
        success: false,
        message: "No posts found",
      });

    return res.status(200).json({
      success: true,
      posts,
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

  const cacheKey = `igclone2_user_posts:${id}`;
  const lockKey = `lock:${cacheKey}`;

  let lockAcquired = false;

  try {
    const cached = await getCache(cacheKey);

    if (cached) {
      console.log("Serving from redis");
      return res.json({
        success: true,
        posts: typeof cached === "string" ? JSON.parse(cached) : cached,
      });
    }

    // 🔒 Acquire lock
    const lock =
      process.env.NODE_ENV === "production"
        ? await redis.set(lockKey, "locked", { nx: true, ex: 60 })
        : await redis.set(lockKey, "locked", { NX: true, EX: 60 });

    if (lock) {
      lockAcquired = true;
    }

    // ❗ If lock NOT acquired → wait
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

    console.log(`[${id}] 🐢 Simulating slow DB...`);
    await new Promise((res) => setTimeout(res, 15000)); // 15 sec delay

    // 🔥 DB call (only one request ideally)
    const posts = await Post.find({ author: id })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "userName profilePic" })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 }, limit: 2 },
        populate: {
          path: "author",
          select: "userName profilePic",
        },
      })
      .lean();

    if (posts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No posts found",
      });
    }

    await setCache(cacheKey, posts, 300);

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
  } finally {
    // 🔓 Release lock (CRITICAL)
    if (lockAcquired) {
      await redis.del(lockKey);
    }
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
    if (!comments)
      return res.status(400).json({
        success: false,
        message: "No comments found",
      });

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error: any) {
    console.log("Error in getAllComments:", error.message);

    return res.status(500).json({
      success: false,
      message: "Error in getAllComments",
    });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; //post id
    const { userId: clerkId } = req.auth!();

    console.log("user id", clerkId);
    const authUser = await User.findOne({ clerkId: clerkId });
    console.log("user", authUser);
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
    const { userId: clerkId } = req.auth!();
    const { id } = req.params; //post id

    const post = await Post.findById(id);
    if (!post)
      return res.status(401).json({
        message: "No post found",
      });

    const authUser = await User.findOne({ clerkId });
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

export const getAllReels = async (req: Request, res: Response) => {
  try {
    const videos = await Post.aggregate([
      // 1️⃣ Only single-media posts
      { $match: { media: { $size: 1 } } },

      // 2️⃣ Flatten media
      { $unwind: "$media" },

      // 3️⃣ Keep only videos
      { $match: { "media.type": "video" } },

      // 4️⃣ Join author
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },

      // 5️⃣ Shape response + counts
      {
        $project: {
          caption: 1,
          createdAt: 1,

          video: {
            url: "$media.url",
            publicId: "$media.publicId",
          },

          author: {
            followers: "$author.followers",
            _id: "$author._id",
            userName: "$author.userName",
            profilePic: "$author.profilePic",
          },

          likes: 1,

          comments: 1,
        },
      },
    ]);
    if (!videos)
      return res
        .status(200)
        .json({ success: true, message: "No reels present" });

    return res.status(200).json({ success: true, videos });
  } catch (error: any) {
    console.log("Error in getAllReels:", error);

    return res.status(500).json({
      success: false,
      message: "Error in getAllReels",
    });
  }
};
