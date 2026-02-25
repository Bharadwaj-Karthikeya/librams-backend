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

router.post("/signup", rateLimiter, validateSchema(requestOtpSchema), signup);

router.post("/verify", rateLimiter, validateSchema(verifyUserSchema), verifyUser);

router.post(
  "/create",
  validateSchema(createUserSchema),
  uploadPsize.single("profilePic"),
  createUser,
);

router.post("/login", rateLimiter, validateSchema(loginSchema), login);

router.put("/profile", rateLimiter, validateSchema(updateProfileSchema),  updateUserProfile);

router.get("/profile", rateLimiter, validateSchema(getUserProfileSchema), getUserProfile);

router.delete("/delete", rateLimiter, validateSchema(deleteUserSchema), deleteUser);

router.post("/reset-password", rateLimiter, validateSchema(resetPasswordSchema), resetPassword);

export default router;
