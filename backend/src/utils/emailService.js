import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";

dotenv.config();

/**
 * Generates a 6-digit numeric OTP.
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hashes an OTP using bcryptjs.
 * @param {string} otp - The plain text OTP
 */
export const hashOTP = async (otp) => {
  return await bcryptjs.hash(otp, 8);
};

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an OTP email to the user.
 * @param {string} to - Recipient email address
 * @param {string} otp - The OTP code to send
 */
export const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: `"FutsalMania" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Verification Code - FutsalMania",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #fbbf24; text-align: center;">Welcome to FutsalMania!</h2>
        <p>Hello,</p>
        <p>Thank you for registering. Please use the following One-Time Password (OTP) to verify your account. This code is valid for 10 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000; background: #fbbf24; padding: 10px 20px; border-radius: 5px;">
            ${otp}
          </span>
        </div>
        <p>If you did not request this code, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">&copy; 2026 FutsalMania. All rights reserved.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("[EmailService] OTP sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("[EmailService] Error sending OTP:", error);
    throw new Error("Failed to send OTP email");
  }
};

export default transporter;
