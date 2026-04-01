import { Request, Response } from "express";
import User from "../user/user.model.js";
import { sendEmail } from "@/config/email/emailService.js";
import { getVerificationEmailTemplate } from "@/config/email/emailTemplates.js";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "user already exists" });
    }

    const user = new User({
      email,
      password,
    });

    await user.save();

    const verificationToken = user.getEmailVerificationToken();
    const url = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    const name = user.email
      .split("@")[0] // john.doe
      .replace(/[._]/g, " ") // john doe
      .replace(/\b\w/g, (c) => c.toUpperCase()); // John Doe

    const html = getVerificationEmailTemplate(name, url);
    const subject = "Email Verification";
    // for extra mailing safety
    try {
      await sendEmail(user.email, subject, html);
      return res
        .status(201)
        .json({ success: true, user, message: "Check your email" });
    } catch (error: any) {
      user.emailVerificationToken = undefined;
      user.emailVerificationTokenExpiresAt = undefined;
      await user.save({ validateBeforeSave: false });
      return res
        .status(500)
        .json({ success: false, message: "email could not be sent" });
    }
  } catch (error: any) {
    console.log("error in registerUser:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
