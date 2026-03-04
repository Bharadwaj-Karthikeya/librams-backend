import express from "express";

import {
  createUser,
  login,
  updateUserProfile,
  getUserProfile,
  deleteUser,
  resetPassword,
  updateUserRole,
  changePassword,
} from "../controllers/auth.controller.js";

import {
  authMiddleware,
  rolesMiddleware,
  validateSchema,
} from "../middlewares/auth.middleware.js";

import {
  createUserSchema,
  loginSchema,
  resetPasswordSchema,
  updateProfileSchema,
  updateUserRoleSchema,
  deleteUserSchema,
  changePasswordSchema,
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

router.patch(
  "/profile",
  rateLimiter,
  authMiddleware,
  uploadPsize.single("profilePic"),
  validateSchema(updateProfileSchema),
  updateUserProfile,
);

router.get("/profile", rateLimiter, authMiddleware, getUserProfile);

router.delete(
  "/delete",
  rateLimiter,
  authMiddleware,
  validateSchema(deleteUserSchema),
  deleteUser,
);

router.post(
  "/reset-password",
  rateLimiter,
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  validateSchema(resetPasswordSchema),
  resetPassword,
);

router.post(
  "/change-password",
  rateLimiter,
  authMiddleware,
  validateSchema(changePasswordSchema),
  changePassword,
);

router.post(
  "/update-role",
  rateLimiter,
  authMiddleware,
  rolesMiddleware(["admin"]),
  validateSchema(updateUserRoleSchema),
  updateUserRole,
);



export default router;
