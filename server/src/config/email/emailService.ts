import * as nodemailer from "nodemailer";

import dotenv from "dotenv";
dotenv.config();

// Step 1: Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL, // your email
    pass: process.env.APP_PASSWORD, // the app password you generated, paste without spaces
  },
  secure: false,
  port: 465,
  tls: { rejectUnauthorized: false },
});

export const sendEmail = async (
  email: string,

  subject: string,
  html: string,
) => {
  try {
    const message = {
      from: `"Instagram Clone" <${process.env.EMAIL}>`,
      to: email,
      subject,
      html,
    };

    const info = await transporter.sendMail(message);

    console.log("✅ Email sent", info.messageId);
  } catch (error: any) {
    console.error(`Error sending ${subject} email:`, error.message);

    throw new Error("Email could not be sent");
  }
};
