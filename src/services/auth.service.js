import User from "../models/User.js";
import { createOTPEntry, verifyOTP } from "./otp.service.js";
import { uploadProfilePic } from "../utils/uploadUtils.js";
import { generateToken, tempToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

export const signupService = async ({ email }) => {
  console.log("Signup Service called ", { email });

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    console.error("User with this email already exists: ", email);
    throw new Error("User with this email already exists");
  }

  const { emailInfo } = await createOTPEntry(email);

  const tempTokenValue = tempToken({ emailInfo });

  return { tempTokenValue };
};

export const verifyUserService = async ({ otp , token }) => {
  console.log("Verify User Service called ", { otp , token });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const verifiedEmail = await verifyOTP({ email: decoded.email, otp });

  if (!verifiedEmail) {
    console.error("OTP verification failed for email: ", decoded.email);
    throw new Error("OTP verification failed");
  }

  return verifiedEmail;
};

export const createUserService = async ({
  email,
  name,
  password,
  role,
  profilePic,
}) => {
  console.log("Create User Service called ", {
    email,
    name,
    password,
    role,
    profilePic,
  });

  let profilePicUrl = null;

  if (profilePic) {
    profilePicUrl = await uploadProfilePic(profilePic);
  }

  const newUser = await User.create({
    email,
    name,
    password : await bcrypt.hash(password, 10),
    role: role || "user",
    profilePic: profilePicUrl ,
  });

  const token = generateToken(newUser._id);

  return { token, user: newUser };
};

export const loginService = async ({ email, password }) => {
  console.log("Login Service called ", { email, password });

  if (!email || !password) {
    console.error("Missing required fields email or password");
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    console.error("User not found with email: ", email);
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    console.error("Invalid password for user: ", email);
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id);
    
  return { token, user };
};
