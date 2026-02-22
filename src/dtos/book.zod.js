import zod from "zod";

export const createBookSchema = zod.object({
  title: zod.string().min(1, "Title is required"),
  author: zod.string().min(1, "Author is required"),
  isbn: zod.string().min(1, "ISBN is required"),
  description: zod.string().optional(),
  publishedYear: zod.number().optional(),
  category: zod.string().min(1, "Category is required"),
  bookCover: zod.string().optional(),
  copies: zod.number(),
}).strict();

export const updateBookSchema = zod.object({
    bookId: zod.string(),
    updateFields: zod.object({
      title: zod.string().optional(),
      author: zod.string().optional(),
      category: zod.string().optional(),
      description: zod.string().optional(),
      totalCopies: zod.number().int().positive().optional(),
      bookCover: zod.string().optional(),
      isActive: zod.boolean().optional(),
      isAvailableForIssue: zod.boolean().optional()
    }).strict()
});

export const getBooksSearchSchema = zod.object({
  searchTerm: zod.string().optional(),
});

export const getbooksByCategorySchema = zod.object({
  category: zod.string().min(1, "Category is required"),
});

export const getBookDetailsSchema = zod.object({
  bookId: zod.string().min(1, "Book ID is required"),
});

export const deleteBookSchema = zod.object({
  bookId: zod.string().min(1, "Book ID is required"),
});

