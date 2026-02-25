import Book from "../models/Book.js";
import User from "../models/User.js";
import { uploadContent } from "../utils/uploadUtils.js";

const resolveRole = async (userId) => {
  const user = await User.findById(userId).select("role");
  return user?.role ?? "student";
};

// Creates a book with optional cover upload, defaulting availability to total copies.
export const addBookService = async ({ bookData, userId, coverFile }) => {
  console.info("[BooksService] Adding book", { isbn: bookData.isbn, userId });
  const existingBook = await Book.findOne({ isbn: bookData.isbn });
  if (existingBook) {
    throw new Error("Book with this ISBN already exists");
  }

  if (coverFile) {
    bookData.bookCover = await uploadContent(coverFile, "Librams/Books");
  }

  const newBook = await Book.create({
    ...bookData,
    availableCopies: bookData.copies,
    isActive: true,
    isAvailableforIssue: true,
    createdBy: userId,
    updatedBy: userId,
  });

  return newBook;
};

// Returns books filtered by role (students only see available titles).
export const getBooksService = async ({ userId }) => {
  const role = await resolveRole(userId);
  console.info("[BooksService] Listing books", { userId, role });
  const query = role === "student"
    ? { isActive: true, isAvailableforIssue: true }
    : {};
  return Book.find(query).sort({ availableCopies: -1, updatedAt: -1 });
};

// Retrieves a single book respecting visibility rules.
export const getBookDetailsService = async ({ userId, bookId }) => {
  const role = await resolveRole(userId);
  console.info("[BooksService] Fetching book details", { bookId, role });
  const query = role === "student"
    ? { _id: bookId, isActive: true, isAvailableforIssue: true }
    : { _id: bookId };

  const book = await Book.findOne(query);
  if (!book) {
    throw new Error("Book not found");
  }
  return book;
};

// Lists books for a category, applying student visibility rules.
export const getBooksByCategoryService = async ({ userId, category }) => {
  const role = await resolveRole(userId);
  console.info("[BooksService] Category lookup", { category, role });
  const query = role === "student"
    ? { category, isActive: true, isAvailableforIssue: true }
    : { category };
  return Book.find(query).sort({ availableCopies: -1, updatedAt: -1 });
};

// Text search over books honoring student restrictions.
export const getBookBySearchService = async ({ userId, searchTerm }) => {
  const role = await resolveRole(userId);
  const trimmedTerm = searchTerm?.trim();
  if (!trimmedTerm) {
    throw new Error("Search term is required");
  }
  console.info("[BooksService] Searching books", { searchTerm: trimmedTerm, role });
  const baseQuery = {
    $text: { $search: trimmedTerm },
  };

  const filter = role === "student"
    ? { ...baseQuery, isActive: true, isAvailableforIssue: true }
    : { ...baseQuery, isActive: true };

  return Book.find(filter, { score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } });
};

// Updates book metadata and cover while keeping counts consistent.
export const updateBookService = async ({ bookId, updateFields, userId, coverFile }) => {
  console.info("[BooksService] Updating book", { bookId, userId });
  const existingBook = await Book.findById(bookId);

  if (!existingBook) {
    throw new Error("Book not found");
  }

  const updateData = { ...updateFields };
  if (coverFile) {
    updateData.bookCover = await uploadContent(coverFile, "Librams/Books");
  }

  const targetTotal = updateData.copies ?? existingBook.copies;
  const targetAvailable = updateData.availableCopies ?? existingBook.availableCopies;
  if (targetAvailable > targetTotal) {
    throw new Error("Available copies cannot exceed total copies");
  }

  const book = await Book.findOneAndUpdate(
    { _id: bookId },
    { $set: { ...updateData, updatedBy: userId } },
    { new: true },
  );

  return book;
};

// Soft deletes a book by flipping its active flag.
export const deleteBookService = async (bookId) => {
  console.info("[BooksService] Soft deleting book", { bookId });
  const book = await Book.findById(bookId);
  if (!book) {
    throw new Error("Book not found");
  }
  book.isActive = false;
  await book.save();
  return { message: "Book deleted successfully" };
};

// Permanently removes a book document.
export const deleteBookPermanentlyService = async (bookId) => {
  console.info("[BooksService] Hard deleting book", { bookId });
  await Book.findByIdAndDelete(bookId);
  return { message: "Book deleted successfully" };
};