import nodemailer from "nodemailer";
import dns from "dns";
import dotenv from "dotenv";

dns.setDefaultResultOrder("ipv4first");

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,

  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },

  connectionTimeout: 10000,
});

export const sendEmail = async (
  email: string,
  subject: string,
  html: string,
) => {
  try {
    const info = await transporter.sendMail({
      from: `"Instagram Clone" <${process.env.EMAIL}>`,
      to: email,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (error: any) {
    console.error("MAIL ERROR:", error);

    throw new Error(error.message);
  }
};
