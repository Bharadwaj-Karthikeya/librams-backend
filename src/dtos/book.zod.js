import zod from "zod";

const objectIdField = zod.string().length(24, "Invalid identifier");

export const createBookSchema = zod.object({
  body: zod.object({
    title: zod.string().min(1, "Title is required"),
    author: zod.string().min(1, "Author is required"),
    isbn: zod.string().min(1, "ISBN is required"),
    description: zod.string().optional(),
    publishedYear: zod.coerce.number().optional(),
    category: zod.string().min(1, "Category is required"),
    bookCover: zod.string().optional(),
    copies: zod.coerce.number().int().positive(),
  }).strict(),
});

export const updateBookSchema = zod.object({
  body: zod.object({
    bookId: objectIdField,
    title: zod.string().optional(),
    author: zod.string().optional(),
    category: zod.string().optional(),
    description: zod.string().optional(),
    copies: zod.coerce.number().int().positive().optional(),
    availableCopies: zod.coerce.number().int().nonnegative().optional(),
    bookCover: zod.string().optional(),
    isActive: zod.coerce.boolean().optional(),
    isAvailableforIssue: zod.coerce.boolean().optional(),
  }).strict(),
});

export const getBooksSearchSchema = zod.object({
  query: zod.object({
    searchTerm: zod.string().min(1, "Search query is required"),
  }).strict(),
});

export const getbooksByCategorySchema = zod.object({
  params: zod.object({
    category: zod.string().min(1, "Category is required"),
  }).strict(),
});

export const getBookDetailsSchema = zod.object({
  params: zod.object({
    bookId: objectIdField,
  }).strict(),
});

export const deleteBookSchema = zod.object({
  body: zod.object({
    bookId: objectIdField,
  }).strict(),
});

