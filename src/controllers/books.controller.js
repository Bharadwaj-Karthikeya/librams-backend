import {
  addBookService,
  getBooksService,
  getBookBySearchService,
  getBookDetailsService,
  getBooksByCategoryService,
  updateBookService,
  deleteBookService,
  deleteBookPermanentlyService,
} from "../services/books.service.js";


// Persists a new book entry with optional cover upload.
export const addBook = async (req, res) => {
  const { body } = req;
  console.info("[BooksController] Add book", { isbn: body.isbn, userId: req.user?.userId });
  try {
    const newBook = await addBookService({
      bookData: body,
      userId: req.user.userId,
      coverFile: req.file,
    });
    res.status(201).json(newBook);
  } catch (error) {
    console.error("[BooksController] Add book failed", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Lists books visible to the authenticated user role.
export const getBooks = async (req, res) => {
  console.info("[BooksController] Get books", { userId: req.user?.userId });
  try {
    const books = await getBooksService({ userId: req.user.userId });
    res.status(200).json(books);
  } catch (error) {
    console.error("[BooksController] Get books failed", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Fetches the details for a single book.
export const getBookDetails = async (req, res) => {
  const { params } = getValidated(req);
  console.info("[BooksController] Book details", { bookId: params.bookId });
  try {
    const book = await getBookDetailsService({
      bookId: params.bookId,
      userId: req.user.userId,
    });
    res.status(200).json(book);
  } catch (error) {
    console.error("[BooksController] Book details failed", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Filters books based on category while respecting user role constraints.
export const getBooksByCategory = async (req, res) => {
  const { params } = req;
  console.info("[BooksController] Books by category", { category: params.category });
  try {
    const books = await getBooksByCategoryService({
      category: params.category,
      userId: req.user.userId,
    });
    res.status(200).json(books);
  } catch (error) {
    console.error("[BooksController] Books by category failed", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Performs a text search across indexed book fields.
export const getBooksBySearch = async (req, res) => {
  const { query } = req;
  console.info("[BooksController] Search books", { query: query.searchTerm });
  try {
    const books = await getBookBySearchService({
      userId: req.user.userId,
      searchTerm: query.searchTerm,
    });
    res.status(200).json(books);
  } catch (error) {
    console.error("[BooksController] Search books failed", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Updates mutable book fields and optionally a cover image.
export const updateBook = async (req, res) => {
  console.log(req)
  const { body } = req;
  console.info("[BooksController] Update book", { bookId: body.bookId });
  try {
    const updatedBook = await updateBookService({
      body: body,
      userId: req.user.userId,
      coverFile: req.file,
    });
    res.status(200).json(updatedBook);
  } catch (error) {
    console.error("[BooksController] Update book failed", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Soft deletes a book by toggling its active state.
export const deleteBook = async (req, res) => {
  const { body } = req;
  console.info("[BooksController] Soft delete book", { bookId: body.bookId });
  try {
    const result = await deleteBookService(body.bookId);
    res.status(200).json(result);
  } catch (error) {
    console.error("[BooksController] Soft delete failed", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Permanently removes a book (admin only).
export const deleteBookPermanently = async (req, res) => {
  const { body } = req;
  console.info("[BooksController] Hard delete book", { bookId: body.bookId });
  try {
    const result = await deleteBookPermanentlyService(body.bookId);
    res.status(200).json(result);
  } catch (error) {
    console.error("[BooksController] Hard delete failed", error.message);
    res.status(400).json({ error: error.message });
  }
};