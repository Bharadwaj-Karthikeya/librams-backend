import {
  issueBook,
  returnIssue,
  getOverdueIssues,
  getUserIssues,
  extendDueDate,
  getAllIssues,
  getIssueDetails,
  getBookIssueHistory,
  getIssuesbySearch,
} from "../controllers/issue.controller.js";

import {
  IssueBookSchema,
  returnIssueSchema,
  getUserIssuesSchema,
  extendDueDateSchema,
} from "../dtos/issue.zod.js";

import {
  authMiddleware,
  rolesMiddleware,
  validateSchema,
} from "../middlewares/auth.middleware.js";

import express from "express";
import { rateLimiter } from "../middlewares/ratelimitter.middleware.js";

const router = express.Router();

router.post(
  "/issue",
  rateLimiter,
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  validateSchema(IssueBookSchema),
  issueBook,
);

router.post(
  "/return/:id",
  rateLimiter,
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  validateSchema(returnIssueSchema),
  returnIssue,
);

router.get(
  "/overdue",
  rateLimiter,
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  getOverdueIssues,
);

router.get(
  "/user",
  rateLimiter,
  authMiddleware,
  validateSchema(getUserIssuesSchema),
  getUserIssues,
);

router.put(
  "/extend/:id",
  rateLimiter,
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  validateSchema(extendDueDateSchema),
  extendDueDate,
);

router.get(
  "/",
  rateLimiter,
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  getAllIssues,
);

router.get(
  "/:id",
  rateLimiter,
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  getIssueDetails,
);

router.get(
  "/book/:bookId",
  rateLimiter,
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  getBookIssueHistory,
);

router.get(
  "/search",
  rateLimiter,
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  getIssuesbySearch,
);

router.get(
  "/my-issues",
  rateLimiter,
  authMiddleware,
  getUserIssues,
);

export default router;