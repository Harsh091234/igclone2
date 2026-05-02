import { spawn } from "child_process";
import ffmpegStatic from "ffmpeg-static";

type CropArea = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export const cropVideo = async (
  inputPath: string,
  outputPath: string,
  crop?: CropArea,
) => {
  return new Promise((resolve, reject) => {
    const args = ["-i", inputPath];

    if (crop) {
      let { x, y, width, height } = crop;

      // ✅ sanitize
      x = Math.floor(x);
      y = Math.floor(y);
      width = Math.floor(width);
      height = Math.floor(height);

      // ✅ EVEN dimensions (CRITICAL)
      width = width - (width % 2);
      height = height - (height % 2);

      if (width <= 0 || height <= 0) {
        return reject(new Error("Invalid crop size"));
      }

      args.push("-vf", `crop=${width}:${height}:${x}:${y}`);
    }

    args.push(
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
      outputPath,
    );

    console.log("FFmpeg args:", args.join(" "));

    const ff = spawn("ffmpeg", args);

    ff.stderr.on("data", (d) => console.log(d.toString()));

    ff.on("close", (code) => {
      if (code === 0) resolve(true);
      else reject(new Error(`FFmpeg failed with code ${code}`));
    });
  });
};
