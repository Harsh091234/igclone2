import { access } from "fs";
import jwt from "jsonwebtoken";

export const sendTokenResponse = async (
  user: any,
  statusCode: number,
  res: any,
) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env
        .ACCESS_TOKEN_EXPIRES as jwt.SignOptions["expiresIn"],
    },
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env
        .REFRESH_TOKEN_EXPIRES as jwt.SignOptions["expiresIn"],
    },
  );

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const cookieOptions = {
    expires: new Date(Date.now() + 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res
    .status(statusCode)
    .cookie("token", accessToken, cookieOptions)
    .json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
};
