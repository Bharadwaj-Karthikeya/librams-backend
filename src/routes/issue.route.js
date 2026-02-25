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
  getIssuesBySearchSchema,
  getIssueDetailsSchema,
  getBookIssueHistorySchema,
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
  "/search",
  rateLimiter,
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  validateSchema(getIssuesBySearchSchema),
  getIssuesbySearch,
);

router.get(
  "/book/:bookId",
  rateLimiter,
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  validateSchema(getBookIssueHistorySchema),
  getBookIssueHistory,
);

router.get(
  "/:id",
  rateLimiter,
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  validateSchema(getIssueDetailsSchema),
  getIssueDetails,
);

router.get(
  "/my-issues",
  rateLimiter,
  authMiddleware,
  validateSchema(getUserIssuesSchema),
  getUserIssues,
);

export default router;