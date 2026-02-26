import express from "express";

import {
  signup,
  createUser,
  login,
  updateUserProfile,
  getUserProfile,
  deleteUser,
  resetPassword,
} from "../controllers/auth.controller.js";

import { authMiddleware, rolesMiddleware, validateSchema } from "../middlewares/auth.middleware.js";
import {
  signupSchema,
  createUserSchema,
  loginSchema,
  resetPasswordSchema,
  updateProfileSchema,
  deleteUserSchema,
} from "../dtos/user.zod.js";

import { uploadPsize } from "../middlewares/upload.middleware.js";
import { rateLimiter } from "../middlewares/ratelimitter.middleware.js";

const router = express.Router();


router.post(
  "/signup",
  validateSchema(createUserSchema),
  uploadPsize.single("profilePic"),
  createUser,
);

router.post("/login", rateLimiter, validateSchema(loginSchema), login);

router.put(
  "/profile",
  rateLimiter,
  authMiddleware,
  uploadPsize.single("profilePic"),
  validateSchema(updateProfileSchema),
  updateUserProfile,
);

router.get(
  "/profile",
  rateLimiter,
  authMiddleware,
  getUserProfile,
);

router.delete(
  "/delete",
  rateLimiter,
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  validateSchema(deleteUserSchema),
  deleteUser,
);

router.post("/reset-password", rateLimiter, validateSchema(resetPasswordSchema), resetPassword);

export default router;
