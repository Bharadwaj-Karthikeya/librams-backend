import mongoose from "mongoose";
import Issue from "../models/Issue.js";
import Book from "../models/Book.js";
import User from "../models/User.js";

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Issues a book copy and tracks inventory atomically.
export const IssueBookService = async ({ userId, body }) => {
  console.info("[IssueService] Issue book", { bookId: body.bookId, toUserEmail: body.toUserEmail });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const toUser = await User.findOne({ email: body.toUserEmail }).session(session);
    if (!toUser) {
      throw new Error("User not found");
    }

    const existingIssue = await Issue.findOne({
      book: body.bookId,
      toUser: toUser._id,
      status: { $in: ["issued", "overdue"] },
    }).session(session);

    if (existingIssue) {
      throw new Error("User already has an active issue for this book");
    }

    const book = await Book.findOneAndUpdate(
      {
        _id: body.bookId,
        availableCopies: { $gt: 0 },
        isActive: true,
        isAvailableforIssue: true,
      },
      { $inc: { availableCopies: -1 } },
      { new: true, session },
    );

    if (!book) {
      throw new Error("No copies available");
    }

    const newIssue = await Issue.create([
      {
        book: body.bookId,
        toUser: toUser._id,
        byUser: userId,
        dueDate: body.dueDate,
      },
    ], { session });

    await session.commitTransaction();
    return newIssue[0];
  } catch (error) {
    await session.abortTransaction();
    console.error("[IssueService] Issue creation failed", error.message);
    throw error;
  } finally {
    session.endSession();
  }
};

// Returns a book issue and restores the copy count.
export const returnIssueService = async (issueId) => {
  console.info("[IssueService] Return issue", { issueId });
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const issue = await Issue.findOneAndUpdate(
      {
        _id: issueId,
        status: { $in: ["issued", "overdue"] },
      },
      {
        $set: {
          status: "returned",
          returnedDate: new Date(),
        },
      },
      { new: true, session },
    );

    if (!issue) {
      throw new Error("Issue not found or already returned");
    }

    const book = await Book.findOneAndUpdate(
      { _id: issue.book },
      { $inc: { availableCopies: 1 } },
      { new: true, session },
    );

    if (!book) {
      throw new Error("Book not found");
    }

    await session.commitTransaction();
    return issue;
  } catch (error) {
    await session.abortTransaction();
    console.error("[IssueService] Return failed", error.message);
    throw error;
  } finally {
    session.endSession();
  }
};

// Retrieves all issues for a specific user.
export const getUserIssuesService = async (userId) => {
  console.info("[IssueService] Fetching user issues", { userId });
  return Issue.find({ toUser: userId })
    .populate("book", "title author")
    .populate("byUser", "name email")
    .sort({ issueDate: -1 });
};

// Lists all overdue issues, auto-updating statuses.
export const getOverdueIssuesService = async () => {
  console.info("[IssueService] Fetch overdue issues");
  const now = new Date();
  await Issue.updateMany(
    { dueDate: { $lt: now }, status: "issued" },
    { $set: { status: "overdue" } },
  );

  return Issue.find({ dueDate: { $lt: now }, status: "overdue" })
    .populate("book", "title author")
    .populate("toUser", "name email")
    .populate("byUser", "name email");
};

// Lists all issues regardless of status.
export const getAllIssuesService = async () => {
  console.info("[IssueService] Fetch all issues");
  return Issue.find()
    .populate("book", "title author")
    .populate("toUser", "name email")
    .populate("byUser", "name email")
    .sort({ issueDate: -1 });
};

// Retrieves the details for a single issue.
export const getIssueDetailsService = async (issueId) => {
  console.info("[IssueService] Issue details", { issueId });
  const issue = await Issue.findById(issueId)
    .populate("book", "title author")
    .populate("toUser", "name email")
    .populate("byUser", "name email");

  if (!issue) {
    throw new Error("Issue not found");
  }
  return issue;
};

// Extends the due date of an active issue.
export const extendDueDateService = async (issueId, newDueDate) => {
  console.info("[IssueService] Extend due date", { issueId });
  const issue = await Issue.findOneAndUpdate(
    { _id: issueId, status: { $in: ["issued", "overdue"] } },
    { $set: { dueDate: newDueDate, status: "issued" } },
    { new: true },
  );

  if (!issue) {
    throw new Error("Active issue not found");
  }

  return issue;
};

// Builds a history of issues for a specific book.
export const getBookIssueHistoryService = async (bookId) => {
  console.info("[IssueService] Book issue history", { bookId });
  return Issue.find({ book: bookId })
    .populate("toUser", "name email")
    .populate("byUser", "name email")
    .sort({ issueDate: -1 });
};

// Searches issues by matching book titles/authors, user name/email, or status text.
export const getIssuesbySearchService = async (searchTerm) => {
  const trimmedTerm = searchTerm?.trim();
  if (!trimmedTerm) {
    throw new Error("Search term is required");
  }

  console.info("[IssueService] Search issues", { searchTerm: trimmedTerm });
  const regex = new RegExp(escapeRegex(trimmedTerm), "i");

  const [matchingBooks, matchingUsers] = await Promise.all([
    Book.find({ $text: { $search: trimmedTerm } }, { _id: 1 }),
    User.find({ $or: [{ name: regex }, { email: regex }] }, { _id: 1 }),
  ]);

  const bookIds = matchingBooks.map((book) => book._id);
  const userIds = matchingUsers.map((user) => user._id);

  return Issue.find({
    $or: [
      { book: { $in: bookIds } },
      { toUser: { $in: userIds } },
      { byUser: { $in: userIds } },
      { status: regex },
    ],
  })
    .populate("book", "title author")
    .populate("toUser", "name email")
    .populate("byUser", "name email")
    .lean();
};