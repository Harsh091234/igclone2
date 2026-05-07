import { Resend } from "resend";



const resend = new Resend("re_YcRZoLVv_3wD7zd1j4MTPnH4TZTHgLkry");


export const sendEmail2 = async (
  email: string,
  subject: string,
  html: string,
) => {
  try {
    const data = await resend.emails.send({
      from: `Instagram Clone <${process.env.EMAIL}>`,
      to: email,
      subject,
      html,
    });

    console.log("✅ Email sent:", data);
  } catch (error) {
    console.error("❌ Resend email error:", error);
    throw new Error("Email could not be sent");
  }
};