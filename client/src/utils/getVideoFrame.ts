export const getVideoFrame = (
  videoUrl: string
): Promise<{
  frame: string;
  width: number;
  height: number;
}> => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.src = videoUrl;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;

    video.addEventListener("loadeddata", () => {
      video.currentTime = 0.1;
    });

    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");

      const width = video.videoWidth;
      const height = video.videoHeight;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, width, height);

      resolve({
        frame: canvas.toDataURL("image/jpeg"),
        width,
        height,
      });
    });
  });
};