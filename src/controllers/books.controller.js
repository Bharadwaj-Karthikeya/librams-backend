import {
  addBookService,
  getBooksService,
  getBookBySearchService,
  getBookDetailsService,
  getBooksByCategoryService,
  updateBookService,
  deleteBookService,
  deleteBookPermanentlyService
} from "../services/books.service.js";

export const addBook = async (req, res) => {
  try {
    const newBook = await addBookService(req);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getBooks = async (req, res) => {
  try {
    const books = await getBooksService(req);
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getBookDetails = async (req, res) => {
  try {
    const book = await getBookDetailsService(req.params.bookId);
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getBooksByCategory = async (req, res) => {
  try {
    const books = await getBooksByCategoryService(req.params.category);
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getBooksBySearch = async (req, res) => {
  try {
    const books = await getBookBySearchService(req.query.q);
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const updatedBook = await updateBookService(req);
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



export const deleteBook = async (req, res) => {
  try {
    const result = await deleteBookService(req.body.bookId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteBookPermanently = async (req, res) => {
  try {
    const result = await deleteBookPermanentlyService(req.body.bookId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}