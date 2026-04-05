import {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken";
import User from "../modules/user/user.model.js";

interface JwtPayload {
  id: string;
  tokenVersion: number;
  role?: string;
}

export const protectRoutes = async(req: Request, res: Response, next: NextFunction) => {
    try {
        
  const accessToken =
  req.cookies.access_token ||
  (req.headers?.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : undefined);
    if(!accessToken) return res.status(401).json({success:false, message: "Unauthorized, Authentication required"});

        const secret = process.env.ACCESS_TOKEN_SECRET;

if (!secret) {
  throw new Error("ACCESS_TOKEN_SECRET is not defined");
}

const decoded = jwt.verify(accessToken, secret) as JwtPayload;
 
    const user = await User.findById(decoded.id).select("-password");
    if(!user || user.tokenVersion !== decoded.tokenVersion) return res.status(401).json({success:false, message: "User belongs to token no longer exits"});
    req.user = user;
    next();

    } catch (error: any) {
         if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired"
    });
  }

  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
  console.log("Error in protectRoutes:", error.message)
  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
    }
}