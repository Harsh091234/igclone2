import { Request, Response } from "express";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";


export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { userId: clerkId } = req.auth!();
    const authUser = await User.findOne({ clerkId });
    if (!authUser)
      return res
        .status(401)
        .json({ success: false, message: "No auth user found" });
    const notifications = await Notification.find({
      receiver: authUser._id,
    })
      .populate("sender", "userName profilePic")
      .populate("post", "media")
      .populate("comment", "text")
      .sort({ createdAt: -1 });
    if (notifications.length === 0)
      return res
        .status(200)
        .json({ success: true, message: "No notifications present" });
        console.log(notifications)
    return res
      .status(200)
      .json({ success: true, notifications });
  } catch (error: any) {
     console.log("Error in getNotifications:", error.message);

     return res.status(500).json({
       success: false,
       message: "Error in getNotifications",
     });
  }
};
