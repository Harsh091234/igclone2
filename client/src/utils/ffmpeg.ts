import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const ffmpeg = new FFmpeg();

let isLoaded = false;

export const loadFFmpeg = async () => {
  if (isLoaded) return;

  await ffmpeg.load(); // ✅ no CDN, no worker config

  isLoaded = true;
};

export const cropVideo = async (
  file: File,
  crop: { width: number; height: number; x: number; y: number },
): Promise<string> => {
  await loadFFmpeg();

  const input = "input.mp4";
  const output = "output.mp4";

  await ffmpeg.writeFile(input, await fetchFile(file));

  await ffmpeg.exec([
    "-i",
    input,
    "-vf",
    `crop=${crop.width}:${crop.height}:${crop.x}:${crop.y}`,
    "-c:v",
    "libx264",
    "-preset",
    "ultrafast",
    "-crf",
    "28",
    output,
  ]);

  const data = await ffmpeg.readFile(output);

  const blob = new Blob([new Uint8Array(data as Uint8Array)], {
    type: "video/mp4",
  });

  return URL.createObjectURL(blob);
};
