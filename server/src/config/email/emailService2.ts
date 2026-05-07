import emailjs from "@emailjs/nodejs";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (data: {
  email: string;
  name: string;
  action_url: string;
  subject: string;
  message: string;
  button_text: string;
  button_color: string;
}) => {
  try {
    console.log("data in email", data)
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      {
        to_email: data.email,
        name: data.name,
        action_url: data.action_url,
        message: data.message,
        title: data.subject,
        button_text: data.button_text,
        button_color: data.button_color,
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.EMAILJS_PRIVATE_KEY!,
      },
    );

    console.log("✅ Email sent:", response.status);
    return response;
  } catch (error) {
    console.log("MAIL ERROR:", error);
    throw error;
  }
};
