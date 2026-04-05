import { Request, Response, NextFunction } from "express"
import { success } from "zod"

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if(!req.user)  {
            return res.status(401).json({
                success:false,
                message: "Not authorized, user data not found"
            })
        }
        // ✅ Admin bypass (key change)
       if (req.user.role === "admin") {
        return next();
       }
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User Role: < ${req.user.role} > is not authorized to access this resource`
            });
        }

        next();
    }
} 