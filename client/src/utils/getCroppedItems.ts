export default async function getCroppedImg(imageSrc: string, crop: any) {
  const image = new Image();
  image.src = imageSrc;

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx?.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height,
  );

  return new Promise<string>((resolve) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file!));
    }, "image/jpeg");
  });
}

export const getAdjustedCrop = (mediaSize: any, cropPixels: any) => {
  const scaleX = mediaSize.naturalWidth / mediaSize.width;

  const scaleY = mediaSize.naturalHeight / mediaSize.height;

  let width = cropPixels.width * scaleX;
  let height = cropPixels.height * scaleY;
  let x = cropPixels.x * scaleX;
  let y = cropPixels.y * scaleY;

  // ✅ CLAMP to video bounds
  width = Math.min(width, mediaSize.naturalWidth);
  height = Math.min(height, mediaSize.naturalHeight);

  x = Math.max(0, Math.min(x, mediaSize.naturalWidth - width));
  y = Math.max(0, Math.min(y, mediaSize.naturalHeight - height));

  return {
    width: Math.floor(width),
    height: Math.floor(height),
    x: Math.floor(x),
    y: Math.floor(y),
  };
};