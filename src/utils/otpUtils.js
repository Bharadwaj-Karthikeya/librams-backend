import bcrypt from "bcryptjs";

export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

export const hashOTP = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  const hashedOTP = await bcrypt.hash(otp, salt);
  return hashedOTP;
};

export const compareOTP = async (otp, hashedOTP) => {
  const isMatch = await bcrypt.compare(otp, hashedOTP);
  return isMatch;
};