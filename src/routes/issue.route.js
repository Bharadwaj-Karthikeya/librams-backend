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

const router = express.Router();

router.post(
  "/issue",
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  validateSchema(IssueBookSchema),
  issueBook,
);

router.post(
  "/return/:id",
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  validateSchema(returnIssueSchema),
  returnIssue,
);

router.get(
  "/overdue",
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  getOverdueIssues,
);

router.get(
  "/user",
  authMiddleware,
  validateSchema(getUserIssuesSchema),
  getUserIssues,
);

router.put(
  "/extend/:id",
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  validateSchema(extendDueDateSchema),
  extendDueDate,
);

router.get(
  "/",
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  getAllIssues,
);

router.get(
  "/:id",
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  getIssueDetails,
);

router.get(
  "/book/:bookId",
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  getBookIssueHistory,
);

router.get(
  "/search",
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  getIssuesbySearch,
);

export default router;