import {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken";
import User from "../modules/user/user.model.js";


export const protectRoutes = async(req: Request, res: Response, next: NextFunction) => {
    try {
        
  const token =
  req.cookies.token ||
  (req.headers?.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : undefined);
    if(!token) return res.status(401).json({success:false, message: "Unauthorized, Authentication required"});

        const secret = process.env.ACCESS_TOKEN_SECRET;

if (!secret) {
  throw new Error("ACCESS_TOKEN_SECRET is not defined");
}

const decoded = jwt.verify(token, secret) as { id: string };
 
    const user = await User.findById(decoded.id).select("-password");
    if(!user) return res.status(401).json({success:false, message: "User belongs to token no longer exits"});
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