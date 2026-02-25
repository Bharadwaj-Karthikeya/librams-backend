import {
  signupService,
  createUserService,
  loginService,
  getUserProfileService,
  updateUserProfileService,
  deleteUserService,
  resetPasswordService,
} from "../services/auth.service.js";

const getValidatedBody = (req) => req.validated?.body ?? req.body;

// Handles end-user signup by creating an account directly.
export const signup = async (req, res) => {
  const payload = getValidatedBody(req);
  console.info("[AuthController] Signup requested", { email: payload.email });
  try {
    const { user, token } = await signupService(payload);

    res.status(201).json({
      success: true,
      message: "Signup successful",
      user,
      token,
    });
  } catch (error) {
    console.error("[AuthController] Signup failed", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Creates a user account (typically by admins/staff) with extended options.
export const createUser = async (req, res) => {
  const payload = getValidatedBody(req);
  console.info("[AuthController] Create user request", { email: payload.email });
  try {
    const { user, token } = await createUserService({ ...payload, profilePicFile: req.file });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("[AuthController] Create user failed", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Authenticates an existing user and returns a JWT.
export const login = async (req, res) => {
  const payload = getValidatedBody(req);
  console.info("[AuthController] Login request", { email: payload.email });
  try {
    const loggedInUser = await loginService(payload);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: loggedInUser.user._id,
        name: loggedInUser.user.name,
        email: loggedInUser.user.email,
        role: loggedInUser.user.role,
      },
      token: loggedInUser.token,
    });
  } catch (error) {
    console.error("[AuthController] Login failed", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Retrieves the authenticated user's profile.
export const getUserProfile = async (req, res) => {
  const userId = req.user?.userId;
  console.info("[AuthController] Profile lookup", { userId });
  try {
    const userProfile = await getUserProfileService(userId);
    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      user: userProfile,
    });
  } catch (error) {
    console.error("[AuthController] Profile lookup failed", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Allows an authenticated user to update their profile data.
export const updateUserProfile = async (req, res) => {
  const payload = getValidatedBody(req);
  console.info("[AuthController] Update profile request", { userId: req.user?.userId });
  try {
    const updatedUser = await updateUserProfileService(req.user.userId, {
      ...payload,
      profilePicFile: req.file,
    });
    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("[AuthController] Update profile failed", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Removes a user account (admin/staff action).
export const deleteUser = async (req, res) => {
  const payload = getValidatedBody(req);
  console.info("[AuthController] Delete user request", { userId: payload.userId });
  try {
    await deleteUserService(payload.userId);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("[AuthController] Delete user failed", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Resets a user's password once ownership is proven via email.
export const resetPassword = async (req, res) => {
  const payload = getValidatedBody(req);
  console.info("[AuthController] Reset password request", { email: payload.email });
  try {
    await resetPasswordService(payload);
    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("[AuthController] Reset password failed", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};