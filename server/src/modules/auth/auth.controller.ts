import { Request, Response } from "express";
import User from "../user/user.model.js";
import { sendEmail } from "../../config/email/emailService.js";
import {
  getForgotPasswordEmailTemplate,
  getVerificationEmailTemplate,
} from "../../config/email/emailTemplates.js";
import crypto from "crypto";
import { sendTokenResponse } from "../../config/sendTokenResponse.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { success } from "zod";
import Message from "../conversation/message.model.js";
import { sanitizeUser } from "../../config/sanitizeDocs.js";
import Session from "./session.model.js";

export const register = async (req: Request, res: Response) => {
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
    await user.save();
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
     res.status(200).json({success:"true", user})
    } catch (error: any) {
      user.emailVerificationToken = undefined;
      user.emailVerificationTokenExpiresAt = undefined;
      await user.save({ validateBeforeSave: false });
      return res
        .status(500)
        .json({ success: false, message: "email could not be sent" });
    }
  } catch (error: any) {
    console.log("error in register:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const token = req.params.token;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpiresAt: { $gt: new Date() },
    });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Invalid link: token expired or already used",
      });

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error: any) {
    console.log("error in verifyEmail:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const resendVerificationUrl = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({
      email,
    });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });

    if (user && user.isEmailVerified)
      return res.status(400).json({
        success: false,
        message: "User already verified",
      });

    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });
    const url = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    const name = user.email
      .split("@")[0] // john.doe
      .replace(/[._]/g, " ") // john doe
      .replace(/\b\w/g, (c) => c.toUpperCase()); // John Doe
    const html = getVerificationEmailTemplate(name, url);
    const subject = "Email Verification";
    await sendEmail(email, subject, html);
    return res.status(200).json({
      success: true,
      message: "Verification url resent successfully!, Check inbox",
    });
  } catch (error: any) {
    console.log("error in resendVerificatioEmail:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    sendTokenResponse(user, 200, res, req);
  } catch (error: any) {
    console.log("error in login:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken =
      req.cookies.refresh_token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    
    const hashedRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

    //  delete session
    await Session.deleteOne({ refreshToken: hashedRefreshToken });

    //  clear cookies
    res.cookie("refresh_token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.cookie("access_token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error: any) {
    console.log("error in logout:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
   
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid Email" });

    const token = user.getForgotPasswordToken();
    await user.save({ validateBeforeSave: false });

    const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
    const html = getForgotPasswordEmailTemplate(user.fullName, url);

    const subject = "Forgot password";

    await sendEmail(user.email, subject, html);

    return res.status(201).json({
      success: true,
      message: "Forgot password url sent!, Check your email",
    });
  } catch (error: any) {
    console.log("error in forgotPassword:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const token = req.params.token;
    const hashedToken = crypto // for db
        .createHash("sha256")
        .update(token)
        .digest("hex");
    const password = req.body.password;

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpiresAt: {$gt: new Date()}
    })
    
    if(!user) return res.status(401).json({success: false, message: "Invalid or expired token"});

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresAt= undefined;

    
   await user.save();
return res.status(200).json({success: true, message: "Password updated successfully"});
  } catch (error: any) {
    console.log("error in resetPassword:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getMe = async(req: Request, res: Response) => {
  try {
    const user = req.user;
    if(!user) return res.status(401).json({success: false, message: "No user found in request"});
 
     const safeUser = sanitizeUser(user);

    res.status(200).json({success: true, user: safeUser});
  } catch (error: any) {
     console.log("error in getMe:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

interface AuthTokenPayload {
  id: string;
  role: string;
  tokenVersion: number;
}

export const refreshToken = async (req: Request, res: Response) => {
  console.log("refresh token api hitted");
  try {
    const refreshToken = req.cookies.refresh_token || (req.headers?.authorization?.startsWith("Bearer ")? req.headers.authorization.split(" ")[1] : null);
    if (!refreshToken)
      return res.status(400).json({ success: false, message: "Refresh token missing" });
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as AuthTokenPayload;
    if (!decoded.id)
      return res.json({ success: false, message: "failed to verify token" });

    const hashedRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
 const session = await Session.findOne({ refreshToken: hashedRefreshToken });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expired or invalid",
      });
    }

    const user = await User.findById(session.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }


    const accessToken = jwt.sign(
      { id: user._id, role: user.role, tokenVersion:user.tokenVersion },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: process.env
          .ACCESS_TOKEN_EXPIRES as jwt.SignOptions["expiresIn"],
      },
    );

    res.cookie("access_token", accessToken, {
      expires: new Date(Date.now() + 15 * 60 * 1000), // 15 min
       httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/"
    })
      .status(200)
      .json({ success: true, message: "Access token refreshed successfully", accessToken });
  } catch (error: any) {
       console.log("error in refreshToken:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getCsrfToken = async (req: Request, res: Response) => {
  try {
   res.json({csrfToken: req.csrfToken()});
  } catch (error: any) {
       console.log("error in refreshToken:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
