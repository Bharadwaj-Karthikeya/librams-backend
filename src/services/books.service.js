import Book from "../models/Book.js";
import User from "../models/User.js";
import { uploadContent } from "../utils/uploadUtils.js";

export const addBookService = async ({ body, user }) => {
  console.log("Add Book Service called ", { bookData: body });
  const existingBook = await Book.findOne({ isbn: body.isbn });
  if (existingBook) {
    console.error(`Book with ISBN "${body.isbn}" already exists`);
    throw new Error("Book with this ISBN already exists");
  }

  if (body.bookCover) {
    const bookCoverUrl = await uploadContent(body.bookCover);
    body.bookCover = bookCoverUrl;
  }

  const newBook = await Book.create({
    ...body,
    availableCopies: body.copies,
    isActive: true,
    isAvailableforIssue: true,
    createdBy: user.userId,
    updatedBy: user.userId,
  });

  return newBook;
};

export const getBooksService = async ({user}) => {
  const userRole = await User.findById(user.userId).select("role");
  if(userRole.role === "student") {
    const books = await Book.find({ isActive: true, isAvailableforIssue: true }).sort({ availableCopies: -1 });
    return books;
  }
  const books = await Book.find().sort({ availableCopies: -1 });
  return books;
};

export const getBookDetailsService = async ({user, bookId}) => {
  const userRole = await User.findById(user.userId).select("role");
  if(userRole.role === "student") {
    const book = await Book.findOne({ _id: bookId, isActive: true, isAvailableforIssue: true });
    return book;
  }
  const book = await Book.findById(bookId);
  return book;
};

export const getBooksByCategoryService = async ({user, category}) => {
  const userRole = await User.findById(user.userId).select("role");
  if(userRole.role === "student") {
    const books = await Book.find({ category, isActive: true, isAvailableforIssue: true }).sort({ availableCopies: -1 });
    return books;
  }
  const books = await Book.find({ category }).sort({ availableCopies: -1 });
  return books;
};

export const getBookBySearchService = async ({user, searchTerm}) => {
  const userRole = await User.findById(user.userId).select("role");
  if(userRole.role === "student") {
    const books = await Book.find({
      $text: { $search: searchTerm , isActive: true, isAvailableforIssue: true },
    }).sort({ availableCopies: -1 });
    return books;
  }
  const books = await Book.find({
    $text: { $search: searchTerm , isActive: true },
    score: { $meta: "textScore" },
  }).sort({ availableCopies: -1 , score: { $meta: "textScore" } });
  return books;
};

export const updateBookService = async ({ body, user }) => {
  try {
    const existingBook = await Book.findById(body.bookId);

    if (!existingBook) {
      console.error(`Book with ID "${body.bookId}" not found for update`);
      throw new Error("Book not found");
    } 

    const updateData = { ...body.updateFields };
    console.log("Update Book Service called ", { bookId: body.bookId, updateData, user });

    if (updateData.bookCover) {
      const bookCoverUrl = await uploadContent(updateData.bookCover);
      updateData.bookCover = bookCoverUrl;
    }

    if (updateData.copies !== undefined) {
      if(existingBook.copies < updateData.availableCopies) {
        throw new Error("Available copies cannot be less than current available copies");
      }
    }

    const book = await Book.findOneAndUpdate(
      { _id: body.bookId },
      { $set: { ...updateData, updatedBy: user.userId } },
      { new: true },
    );

    return book;
  } catch (error) {
    console.error("Error updating book: ", error);
    throw new Error("Failed to update book");
  }
};

export const deleteBookService = async (bookId) => {
  const book = await Book.findById(bookId);
  if (!book) {
    console.error(`Book with ID "${bookId}" not found for deletion`);
    throw new Error("Book not found");
  }
  book.isActive = false;
  await book.save();
  return { message: "Book deleted successfully" };
};

export const deleteBookPermanentlyService = async (bookId) => {
  await Book.findByIdAndDelete(bookId);
  return { message: "Book deleted successfully" };
};