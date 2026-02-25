import { jest } from "@jest/globals";

const mockIssueModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
};

const mockBookModel = {
  findOneAndUpdate: jest.fn(),
  find: jest.fn(),
};

const mockUserModel = {
  findOne: jest.fn(),
  find: jest.fn(),
};

const mockSession = {
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  abortTransaction: jest.fn(),
  endSession: jest.fn(),
};

const mockStartSession = jest.fn().mockResolvedValue(mockSession);

jest.unstable_mockModule("mongoose", () => ({
  default: { startSession: mockStartSession },
}));

jest.unstable_mockModule("../../src/models/Issue.js", () => ({
  default: mockIssueModel,
}));

jest.unstable_mockModule("../../src/models/Book.js", () => ({
  default: mockBookModel,
}));

jest.unstable_mockModule("../../src/models/User.js", () => ({
  default: mockUserModel,
}));

const issueService = await import("../../src/services/issue.service.js");
const { IssueBookService, getIssuesbySearchService } = issueService;

const withSessionResult = (result) => ({
  session: jest.fn().mockResolvedValue(result),
});

describe("Issue Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSession.startTransaction.mockClear();
    mockSession.commitTransaction.mockClear();
    mockSession.abortTransaction.mockClear();
    mockSession.endSession.mockClear();
  });

  describe("IssueBookService", () => {
    it("issues a book when inventory and user checks pass", async () => {
      mockUserModel.findOne.mockReturnValue(withSessionResult({ _id: "user" }));
      mockIssueModel.findOne.mockReturnValue(withSessionResult(null));
      mockBookModel.findOneAndUpdate.mockResolvedValue({ _id: "book" });
      const newIssue = { _id: "issue" };
      mockIssueModel.create.mockResolvedValue([newIssue]);

      const result = await IssueBookService({
        userId: "librarian",
        body: { bookId: "book", toUserEmail: "student@example.com", dueDate: new Date() },
      });

      expect(mockSession.commitTransaction).toHaveBeenCalled();
      expect(result).toBe(newIssue);
    });

    it("aborts when the borrower email is unknown", async () => {
      mockUserModel.findOne.mockReturnValue(withSessionResult(null));

      await expect(IssueBookService({
        userId: "librarian",
        body: { bookId: "book", toUserEmail: "missing@example.com", dueDate: new Date() },
      })).rejects.toThrow("User not found");

      expect(mockSession.abortTransaction).toHaveBeenCalled();
      expect(mockIssueModel.create).not.toHaveBeenCalled();
    });
  });

  describe("getIssuesbySearchService", () => {
    it("builds the search query across books and users", async () => {
      mockBookModel.find.mockResolvedValue([{ _id: "book-id" }]);
      mockUserModel.find.mockResolvedValue([{ _id: "user-a" }, { _id: "user-b" }]);

      const finalResult = [{ _id: "issue" }];
      const finalStage = { lean: jest.fn().mockResolvedValue(finalResult) };
      const thirdStage = { populate: jest.fn().mockReturnValue(finalStage) };
      const secondStage = { populate: jest.fn().mockReturnValue(thirdStage) };
      const firstStage = { populate: jest.fn().mockReturnValue(secondStage) };
      mockIssueModel.find.mockReturnValue(firstStage);

      const result = await getIssuesbySearchService("science");

      expect(mockIssueModel.find).toHaveBeenCalled();
      const query = mockIssueModel.find.mock.calls[0][0];
      expect(query.$or[0].book.$in).toEqual(["book-id"]);
      expect(query.$or[1].toUser.$in).toEqual(["user-a", "user-b"]);
      expect(result).toEqual(finalResult);
      expect(finalStage.lean).toHaveBeenCalled();
    });

    it("throws when the term is missing", async () => {
      await expect(getIssuesbySearchService("   ")).rejects.toThrow("Search term is required");
    });
  });
});