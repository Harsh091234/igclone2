import { NextFunction, Request, Response } from "express";
import multer from "multer";
import os from "os";
import path from "path";

// for ffmpeg processing
const diskStorage = multer.diskStorage({
  destination: os.tmpdir(), // works on BOTH local + Render
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

export const uploadThroughDisk = multer({
  storage: diskStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // each file size 5mb
  },
});

// for normal uploads
const memoryStorage = multer.memoryStorage();

export const uploadThroughMemory = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

export const handleMulterError = (maxSizeMB: number) => {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: `File too large. Max allowed size is ${maxSizeMB}MB.`,
        });
      }
    }
    next(err);
  };
};