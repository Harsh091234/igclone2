import multer, { StorageEngine } from "multer";


const storage: StorageEngine = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
