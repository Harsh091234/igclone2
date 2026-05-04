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
    fileSize: 20 * 1024 * 1024,
  },
});

// for normal uploads
const memoryStorage = multer.memoryStorage();

export const uploadThroughMemory = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB
  },
});