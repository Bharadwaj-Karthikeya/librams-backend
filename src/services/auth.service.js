import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { uploadProfilePic } from "../utils/uploadUtils.js";
import { generateToken } from "../utils/generateToken.js";

const sanitizeUser = (userDoc) => {
  if (!userDoc) return null;
  const userObject = userDoc.toObject({ getters: true });
  delete userObject.password;
  return userObject;
};

// Creates an end-user account without OTP verification.
export const signupService = async ({ name, email, password }) => {
  console.info("[AuthService] Direct signup", { email });

  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const newUser = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    role: "student",
  });

  const token = generateToken(newUser._id);
  return { token, user: sanitizeUser(newUser) };
};

// Creates a user record and uploads the optional profile picture.
export const createUserService = async ({
  email,
  name,
  password,
  role,
  profilePicFile,
}) => {
  console.info("[AuthService] Creating user", { email });

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  let profilePicUrl = null;
  if (profilePicFile) {
    profilePicUrl = await uploadProfilePic(profilePicFile);
  }

  const newUser = await User.create({
    email,
    name,
    password: await bcrypt.hash(password, 10),
    role: role || "student",
    profilePicture: profilePicUrl,
  });

  const token = generateToken(newUser._id);
  return {
    token,
    user: sanitizeUser(newUser),
  };
};

// Authenticates an existing user and returns a JWT with sanitized profile data.
export const loginService = async ({ email, password }) => {
  console.info("[AuthService] Login attempt", { email });

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id);
  return { token, user: sanitizeUser(user) };
};

// Retrieves a sanitized profile for the supplied user id.
export const getUserProfileService = async (userId) => {
  console.info("[AuthService] Fetching profile", { userId });
  if (!userId) {
    throw new Error("Missing user id");
  }

  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// Applies updates to the authenticated user's profile and uploads a new picture if supplied.
export const updateUserProfileService = async (userId, updateData) => {
  console.info("[AuthService] Updating profile", { userId });
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (updateData.profilePicFile) {
    user.profilePicture = await uploadProfilePic(updateData.profilePicFile);
  }

  if (updateData.name) {
    user.name = updateData.name;
  }

  await user.save();
  return sanitizeUser(user);
};

// Allows a user to change their password after confirming the current password.
export const changePasswordService = async (userId, { currentPassword, newPassword }) => {
  console.info("[AuthService] Changing password", { userId });
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isCurrentPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return { message: "Password changed successfully" };
};

// Deletes a user record permanently.
export const deleteUserService = async (userId) => {
  console.info("[AuthService] Deleting user", { userId });
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return { message: "User deleted successfully" };
};

// Resets a user's password after confirming the account via email.
export const resetPasswordService = async ({ email, newPassword }) => {
  console.info("[AuthService] Resetting password", { email });
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return { message: "Password reset successfully" };
};