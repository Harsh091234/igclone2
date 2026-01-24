import sharp from "sharp";
import User from "../models/user.model.js";
import {Request, Response} from "express"
import { convertToBase64 } from "../config/convertToBase64.js";
import { uploadBase64Image } from "../config/uploadPic.js";
import { uploadVideo } from "../config/uploadVideo.js";
import { uploadRaw } from "../config/uploadRaw.js";
import Conversation from "../models/conversation.model.js";
import Message, { MediaType } from "../models/message.model.js";
import mongoose from "mongoose";
import { CLOUDINARY_FOLDERS } from "../paths/cloudinary.js";

const getMediaType = (mimetype: string) => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype.startsWith("audio/")) return "audio";
  if (mimetype === "application/pdf") return "pdf";
  if (mimetype.includes("excel")) return "xls";
  if (mimetype.includes("word")) return "doc";
  return "doc";
};

export const createMessage = async(req: Request, res: Response) => {
   try {
    const {userId: clerkId} = req.auth!();
  //  const { clerkId } = req.body;
    const sender = await User.findOne({clerkId});
    if(!sender) return res.status(400).json({success: false, message: "No sender found"});
    const senderId = sender._id;
    const receiverId = new mongoose.Types.ObjectId( req.params.id);
     
    const {text} = req.body

    const files = req.files as Express.Multer.File[];
   const media: { url: string; type: MediaType }[] = [];

    for (const file of files || []) {
      const type = getMediaType(file.mimetype);

     // IMAGE
      if (type === "image") {
        const optimizedBuffer = await sharp(file.buffer)
          .resize({ width: 800, height: 800, fit: "inside" })
          .jpeg({ quality: 80 })
          .toBuffer();

        const base64Image = await convertToBase64(optimizedBuffer);

        const uploaded = await uploadBase64Image(
          base64Image,
          CLOUDINARY_FOLDERS.CHAT_IMAGES
        );

        media.push({ url: uploaded.secure_url, type });
      }

      //  VIDEO
      else if (type === "video") {
        const uploaded = await uploadVideo(
          file.buffer,
          CLOUDINARY_FOLDERS.CHAT_VIDEOS
        );
        media.push({ url: uploaded.secure_url, type });
      }

      //  PDF / DOC / XLS / AUDIO
      else {
        const uploaded = await uploadRaw(
          file.buffer,
          CLOUDINARY_FOLDERS.CHAT_RAW_FILES
        );
        media.push({ url: uploaded.secure_url, type });
      }
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants:[senderId, receiverId],
      });
    }

    const message = await Message.create({
      senderId,
      receiverId,
      text,
      media,
      seenBy: [
        {
          userId: senderId,
          seenAt: new Date(),
        },
      ],
    });

    conversation.messages.push(message._id);
    conversation.lastMessage = message._id;
    await conversation.save();

    res.status(201).json({
      success: true,
      message,
      last_message: conversation.lastMessage,
    });
  } catch (err) {
    console.error("Create message error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }

}

export const getAllMessages = async(req: Request, res: Response) => {
  try {
    const {userId: clerkId} = req.auth!();
    // const { clerkId } = req.body;
    const sender = await User.findOne({clerkId});
        if (!sender)
          return res
            .status(400)
            .json({ success: false, message: "No sender found" });
    const userId = sender._id;
    const receiverId = new mongoose.Types.ObjectId(req.params.receiverId);
   
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverId] },
    });

    if (!conversation) {
     
      return res.json({
        success: true,
        conversationId: null,
        messages: [],
      });
    }

  
    const messages = await Message.find({
      _id: { $in: conversation.messages },
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "userName profilePic")
      .lean();

    await Message.updateMany(
      {
        _id: { $in: conversation.messages },
        receiverId: userId,
        "seenBy.userId": { $ne: userId },
      },
      {
        $push: {
          seenBy: {
            userId,
            seenAt: new Date(),
          },
        },
      },
    );

    res.json({
      success: true,
      conversationId: conversation._id,
      messages,
    });
  } catch (error) {
    console.error("Get conversation messages error:", error);
    res.status(500).json({ message: "Internal server error" });
  }

}

export const getLastMessages = async(req: Request, res: Response) => {
   try {
     const { userId: clerkId } = req.auth!();
    // const {clerkId} = req.body;
     const authUser = await User.findOne({ clerkId });
     if (!authUser) {
       return res.status(400).json({
         success: false,
         message: "No auth user not found",
       });
     }

     const userId = authUser._id;

     const conversations = await Conversation.find({
       participants: userId,
     })
       .populate({
         path: "lastMessage",
         select: "senderId receiverId text media createdAt seenBy",
       })
       .sort({ updatedAt: -1 });

     res.status(200).json({
       success: true,
       conversations,
     });
   } catch (error) {
     console.error("Get last messages error:", error);
     res.status(500).json({ message: "Internal server error" });
   }
}