import express from "express";

import {
  getBooks,
  addBook,
  updateBook,
  getBookDetails,
  getBooksByCategory,
  getBooksBySearch,
  deleteBook,
} from "../controllers/books.controller.js";

import {
  authMiddleware,
  rolesMiddleware,
  validateSchema,
} from "../middlewares/auth.middleware.js";

import {
  createBookSchema,
  updateBookSchema,
  deleteBookSchema,
  getBookDetailsSchema,
  getBooksSearchSchema,
  getbooksByCategorySchema,
} from "../dtos/book.zod.js";

import { rateLimiter } from "../middlewares/ratelimitter.middleware.js";

const router = express.Router();

router.post(
  "/add",
  rateLimiter,
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  validateSchema(createBookSchema),
  addBook,
);

router.get(
  "/all", 
  rateLimiter, 
  authMiddleware, 
  getBooks
);

router.patch(
  "/update",
  rateLimiter,
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  validateSchema(updateBookSchema),
  updateBook,
);

router.get(
  "/details/:bookId",
  rateLimiter,
  authMiddleware,
  validateSchema(getBookDetailsSchema),
  getBookDetails,
);

router.get(
  "/category/:category",
  rateLimiter,
  authMiddleware,
  validateSchema(getbooksByCategorySchema),
  getBooksByCategory,
);

router.get(
  "/search",
  rateLimiter,
  authMiddleware,
  validateSchema(getBooksSearchSchema),
  getBooksBySearch,
);

router.delete(
  "/delete",
  rateLimiter,
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  validateSchema(deleteBookSchema),
  deleteBook,
);

router.delete(
  "/delete-complete",
  rateLimiter,
  authMiddleware,
  rolesMiddleware(["admin"]),
  validateSchema(deleteBookSchema),
  deleteBookPermanently,
);

export default router;
