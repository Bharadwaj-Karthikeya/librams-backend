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
  authMiddleware,
  rateLimiter,
  rolesMiddleware(["admin", "staff"]),
  validateSchema(IssueBookSchema),
  issueBook,
);

router.post(
  "/return/:id",
  authMiddleware,
  rateLimiter,
  rolesMiddleware(["admin", "staff"]),
  validateSchema(returnIssueSchema),
  returnIssue,
);

router.get(
  "/overdue",
  authMiddleware,
  rateLimiter,
  rolesMiddleware(["admin", "staff"]),
  getOverdueIssues,
);

router.get(
  "/user",
  authMiddleware,
  rateLimiter,
  validateSchema(getUserIssuesSchema),
  getUserIssues,
);

router.put(
  "/extend/:id",
  authMiddleware,
  rateLimiter,
  rolesMiddleware(["admin", "staff"]),
  validateSchema(extendDueDateSchema),
  extendDueDate,
);

router.get(
  "/",
  authMiddleware,
  rateLimiter,
  rolesMiddleware(["admin", "staff"]),
  getAllIssues,
);

router.get(
  "/:id",
  authMiddleware,
  rateLimiter,
  rolesMiddleware(["admin", "staff"]),
  getIssueDetails,
);

router.get(
  "/book/:bookId",
  authMiddleware,
  rateLimiter,
  rolesMiddleware(["admin", "staff"]),
  getBookIssueHistory,
);

router.get(
  "/search",
  authMiddleware,
  rateLimiter,
  rolesMiddleware(["admin", "staff"]),
  getIssuesbySearch,
);

router.get(
  "/my-issues",
  authMiddleware,
  rateLimiter,
  getUserIssues,
);

export default router;