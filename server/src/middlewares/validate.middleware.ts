import {Request, Response, NextFunction} from "express";
import {ZodType} from "zod"

export const validate = (schema: ZodType) => async(req: Request, res: Response, next: NextFunction) => {
    try {
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    } catch (error: any) {
        res.status(400).json({message: error.errors?.[0]?.message || "Validation failed"});
    }
}
