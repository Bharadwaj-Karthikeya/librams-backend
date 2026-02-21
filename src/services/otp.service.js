import Otp from "../models/Otp.js";
import sendEmail from "../utils/sendEmail.js";
import { generateOTP, hashOTP, compareOTP } from "../utils/otpUtils.js";

export const createOTPEntry = async (email) => {
  const otp = generateOTP();

  const hashedOTP = await hashOTP(otp);

  const emailInfo = await sendEmail({
    email,
    subject: "Your OTP for Librams",
    message: `Your OTP for Librams is: ${otp}. It will expire in 10 minutes.`,
  });

  const otpEntry = await Otp.create({
    email,
    otp: hashedOTP,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
  });

  return { emailInfo, otpEntry };
};

export const verifyOTP = async ({ email, otp }) => {
  const otpEntry = await Otp.findOne({ email });

  if (!otpEntry) {
    console.error(
      `OTP not found for email: ${email}, Maybe expired or already used`,
    );
    throw new Error("OTP not found");
  }

  const isMatch = await compareOTP(otp, otpEntry.otp);
  if (!isMatch) {
    console.error(`Invalid OTP for email: ${email}`);
    throw new Error("Invalid OTP");
  }

  if (otpEntry.expiresAt < new Date()) {
    console.error(`OTP expired for email: ${email}`);
    throw new Error("OTP expired");
  }

  return email;
};
