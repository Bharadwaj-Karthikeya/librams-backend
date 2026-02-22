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
const router = express.Router();

router.post(
  "/add",
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  validateSchema(createBookSchema),
  addBook,
);

router.get("/all", authMiddleware, getBooks);

router.patch(
  "/update",
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  validateSchema(updateBookSchema),
  updateBook,
);

router.get(
  "/details/:bookId",
  authMiddleware,
  validateSchema(getBookDetailsSchema),
  getBookDetails,
);

router.get(
  "/category/:category",
  authMiddleware,
  validateSchema(getbooksByCategorySchema),
  getBooksByCategory,
);

router.get(
  "/search",
  authMiddleware,
  validateSchema(getBooksSearchSchema),
  getBooksBySearch,
);

router.delete(
  "/delete",
  authMiddleware,
  rolesMiddleware(["admin", "staff"]),
  validateSchema(deleteBookSchema),
  deleteBook,
);

router.delete(
  "/delete-complete",
  authMiddleware,
  rolesMiddleware(["admin"]),
  validateSchema(deleteBookSchema),
  deleteBookPermanently,
);

export default router;
