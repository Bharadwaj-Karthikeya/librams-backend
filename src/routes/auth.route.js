import express from "express";

import {
  signup,
  verifyUser,
  createUser,
  login,
} from "../controllers/auth.controller.js";

import { validateSchema } from "../middlewares/auth.middleware.js";
import {
  createUserSchema,
  verifyUserSchema,
  loginSchema,
  requestOtpSchema,
} from "../dtos/user.zod.js";

import { uploadPsize } from "../middlewares/upload.middleware.js";

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

export default router;
