import { access } from "fs";
import jwt from "jsonwebtoken";
import { sanitizeUser } from "./sanitizeDocs.js";
import crypto from "crypto";
import Session from "../modules/auth/session.model.js";
export const sendTokenResponse = async (
  user: any,
  statusCode: number,
  res: any,
  req: any
) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role, tokenVersion: user.tokenVersion },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env
        .ACCESS_TOKEN_EXPIRES as jwt.SignOptions["expiresIn"],
    }
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env
        .REFRESH_TOKEN_EXPIRES as jwt.SignOptions["expiresIn"],
    }
  );

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await Session.create({
    userId: user._id,
    email: user.email,
    refreshToken: hashedRefreshToken,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const accessCookieOptions = {
    expires: new Date(Date.now() + 15 * 60 * 1000), // 15 min
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  };

  const refreshCookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  };

  const safeUser = sanitizeUser(user);
  res
    .status(statusCode)
    .cookie("access_token", accessToken, accessCookieOptions)
    .cookie("refresh_token", refreshToken, refreshCookieOptions)
    .json({
      success: true,
      user: safeUser,
    });
};
