import express from "express";

import {
  signup,
  verifyUser,
  createUser,
  login,
  updateUserProfile,
  getUserProfile,
  deleteUser,
  resetPassword,
} from "../controllers/auth.controller.js";

import { validateSchema } from "../middlewares/auth.middleware.js";
import {
  createUserSchema,
  verifyUserSchema,
  loginSchema,
  requestOtpSchema,
  resetPasswordSchema,
  updateProfileSchema,
  getUserProfileSchema,
  deleteUserSchema,
} from "../dtos/user.zod.js";

import { uploadPsize } from "../middlewares/upload.middleware.js";
import { rateLimiter } from "../middlewares/ratelimitter.middleware.js";

const router = express.Router();

router.post("/signup", validateSchema(requestOtpSchema), signup);

router.post("/verify", validateSchema(verifyUserSchema), verifyUser);

router.post(
  "/create",
  validateSchema(createUserSchema),
  uploadPsize.single("profilePic"),
  createUser,
);

router.post("/login", validateSchema(loginSchema), login);

router.put("/profile", validateSchema(updateProfileSchema), rateLimiter, updateUserProfile);

router.get("/profile", validateSchema(getUserProfileSchema), getUserProfile);

router.delete("/delete", validateSchema(deleteUserSchema), rateLimiter, deleteUser);

router.post("/reset-password", validateSchema(resetPasswordSchema), rateLimiter, resetPassword);

export default router;
