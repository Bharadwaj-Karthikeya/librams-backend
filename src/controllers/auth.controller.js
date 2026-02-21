import {
  signupService,
  verifyUserService,
  createUserService,
  loginService,
} from "../services/auth.service.js";

export const signup = async (req, res) => {
  try {
    const newUser = await signupService(req.body);

    res.status(201).json({
      success: true,
      message: "OTP sent to email successfully",
      email: newUser.emailInfo.email,
      otpEntry: newUser.otpEntry._id,
    });
  } catch (error) {
    res.status(400).json({ 
        success: false, 
        message: error.message 
    });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const verifiedEmail = await verifyUserService(req.body);

    res.status(200).json({
      success: true,
      message: "User verified successfully",
      email: verifiedEmail,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const createdUser = await createUserService({...req.body});

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: createdUser,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const loggedInUser = await loginService({...req.body});

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
    res.status(400).json({ success: false, message: error.message });
  }
};
