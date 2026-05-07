import emailjs from "@emailjs/nodejs";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail2 = async (
  email: string,
  name: string,
  url: string,
) => {
  try {
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      {
        to_email: email,
        name,
        verificationUrl: url,
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.EMAILJS_PRIVATE_KEY!,
      },
    );

    console.log("✅ Email sent:", response.status, response.text);

    return response;
  } catch (error) {
    console.log("MAIL ERROR:", error);

    throw error;
  }
};
