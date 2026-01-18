import sharp from "sharp";
export const convertToBase64 = async (buffer) => {
    const optimizedBuffer = await sharp(buffer)
        .resize({ width: 800, height: 800, fit: "inside" })
        .jpeg({ quality: 80 })
        .toBuffer();
    return `data:image/jpeg;base64,${optimizedBuffer.toString("base64")}`;
};
