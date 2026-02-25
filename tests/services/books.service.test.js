import { jest } from "@jest/globals";

const mockBookModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findById: jest.fn(),
};

const mockUserModel = {
  findById: jest.fn(),
};

const mockUploadUtils = {
  uploadContent: jest.fn(),
};

jest.unstable_mockModule("../../src/models/Book.js", () => ({
  default: mockBookModel,
}));

jest.unstable_mockModule("../../src/models/User.js", () => ({
  default: mockUserModel,
}));

jest.unstable_mockModule("../../src/utils/uploadUtils.js", () => mockUploadUtils);

const booksService = await import("../../src/services/books.service.js");
const { addBookService, getBookBySearchService, updateBookService } = booksService;

describe("Books Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addBookService", () => {
    it("rejects duplicate ISBNs", async () => {
      mockBookModel.findOne.mockResolvedValue({ _id: "book" });

      await expect(addBookService({
        bookData: { isbn: "123", copies: 5 },
        userId: "admin",
      })).rejects.toThrow("Book with this ISBN already exists");
    });

    it("stores the book and uploads the cover", async () => {
      const createdBook = { _id: "book-id" };
      mockBookModel.findOne.mockResolvedValue(null);
      mockUploadUtils.uploadContent.mockResolvedValue("https://cover");
      mockBookModel.create.mockResolvedValue(createdBook);

      const result = await addBookService({
        bookData: { isbn: "123", title: "Sample", copies: 5 },
        userId: "admin",
        coverFile: { buffer: Buffer.from("file") },
      });

      expect(mockUploadUtils.uploadContent).toHaveBeenCalled();
      expect(mockBookModel.create).toHaveBeenCalledWith(expect.objectContaining({
        isbn: "123",
        bookCover: "https://cover",
        availableCopies: 5,
        createdBy: "admin",
        updatedBy: "admin",
      }));
      expect(result).toBe(createdBook);
    });
  });

  describe("getBookBySearchService", () => {
    it("enforces trimming and student visibility", async () => {
      const sortSpy = jest.fn().mockResolvedValue("sorted-books");
      mockBookModel.find.mockReturnValue({ sort: sortSpy });
      mockUserModel.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({ role: "student" }),
      });

      const result = await getBookBySearchService({
        userId: "student-id",
        searchTerm: "  history  ",
      });

      expect(mockBookModel.find).toHaveBeenCalledWith({
        $text: { $search: "history" },
        isActive: true,
        isAvailableforIssue: true,
      }, {
        score: { $meta: "textScore" },
      });
      expect(sortSpy).toHaveBeenCalledWith({ score: { $meta: "textScore" } });
      expect(result).toBe("sorted-books");
    });

    it("throws when the search term is empty", async () => {
      await expect(getBookBySearchService({
        userId: "any",
        searchTerm: "   ",
      })).rejects.toThrow("Search term is required");
    });
  });

  describe("updateBookService", () => {
    it("blocks available copies that exceed the total", async () => {
      mockBookModel.findById.mockResolvedValue({
        copies: 5,
        availableCopies: 4,
      });

      await expect(updateBookService({
        bookId: "book-id",
        updateFields: { copies: 5, availableCopies: 6 },
        userId: "admin",
      })).rejects.toThrow("Available copies cannot exceed total copies");
    });

    it("uploads a new cover and persists the update", async () => {
      mockBookModel.findById.mockResolvedValue({
        copies: 5,
        availableCopies: 4,
      });
      mockUploadUtils.uploadContent.mockResolvedValue("https://cover");
      const updatedBook = { _id: "book-id", title: "Updated" };
      mockBookModel.findOneAndUpdate.mockResolvedValue(updatedBook);

      const result = await updateBookService({
        bookId: "book-id",
        updateFields: { title: "Updated" },
        userId: "admin",
        coverFile: { buffer: Buffer.from("file") },
      });

      expect(mockUploadUtils.uploadContent).toHaveBeenCalled();
      expect(mockBookModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: "book-id" },
        expect.objectContaining({
          $set: expect.objectContaining({
            title: "Updated",
            bookCover: "https://cover",
            updatedBy: "admin",
          }),
        }),
        { new: true },
      );
      expect(result).toBe(updatedBook);
    });
  });
});