import { uploadBase64Image } from "../config/uploadPic.js";
import { uploadVideo } from "../config/uploadVideo.js";

import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { CLOUDINARY_FOLDERS } from "../paths/cloudinary.js";
import { Request, Response } from "express";

import sharp from "sharp";

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

    const media = [];
    for (const file of files) {
      const isVideo = file.mimetype.startsWith("video");

      if (isVideo) {
        const cloudResponse = await uploadVideo(
          file.buffer,
          CLOUDINARY_FOLDERS.POST_VIDEOS,
        );

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
        "base64",
      )}`;

      // 🔹 upload to cloudinary
      const cloudResponse = await uploadBase64Image(
        base64Image,
        CLOUDINARY_FOLDERS.POST_IMAGES,
      );

      media.push({
        url: cloudResponse.secure_url,
        publicId: cloudResponse.public_id,
        type: "image",
      });
    }

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

//get post + top 2 comments
export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; //author id
    const posts = await Post.find({ author: id })
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
    console.log("Error in getUserPosts:", error.message);

    return res.status(500).json({
      success: false,
      message: "Error in getUserPosts",
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
