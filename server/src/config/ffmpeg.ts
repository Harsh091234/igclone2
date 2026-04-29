import { spawn } from "child_process";
import ffmpegStatic from "ffmpeg-static";

type CropArea = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export const cropVideo = (
  input: string,
  output: string,
  crop: CropArea
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!ffmpegStatic) {
      return reject(new Error("FFmpeg binary not found"));
    }

    // ✅ TypeScript-safe fix
    const ffmpegPath = ffmpegStatic as unknown as string;

    const args = [
      "-i",
      input,

      "-vf",
      `crop=${Math.round(crop.width)}:${Math.round(
        crop.height
      )}:${Math.round(crop.x)}:${Math.round(
        crop.y
      )},scale=1080:1920`,

      "-c:v",
      "libx264",

      "-preset",
      "fast",

      "-crf",
      "23",

      "-c:a",
      "aac",

      "-movflags",
      "+faststart",

      "-y",
      output,
    ];

    const ffmpeg = spawn(ffmpegPath, args);

    ffmpeg.stderr.on("data", (data) => {
      console.log(data.toString());
    });

    ffmpeg.on("error", (err) => {
      reject(err);
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(`FFmpeg exited with code ${code}`)
        );
      }
    });
  });
};