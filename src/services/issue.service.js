import Issue from "../models/Issue.js";
import Book from "../models/Book.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const IssueBookService = async ({ user, body }) => {
  console.log("Create Issue Service called ", {
    bookId: body.bookId,
    toUserEmail: body.toUserEmail,
    byUserId: user._id,
    dueDate: body.dueDate,
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const toUser = await User.findOne({ email: body.toUserEmail }).session(
      session,
    );
    if (!toUser) {
      console.error("User not found with email: ", body.toUserEmail);
      throw new Error("User not found");
    }

    const existingIssue = await Issue.findOne({
      book: body.bookId,
      toUser: toUser._id,
      status: "issued",
    }).session(session);

    if (existingIssue) {
      console.error(
        "User already has an active issue for book id: ",
        body.bookId,
        " user email: ",
        body.toUserEmail,
      );
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

    console.log(
      "Book found: ",
      book.title,
      " Copies available: ",
      book.availableCopies,
    );

    console.log(
      "Updated copies available for book id: ",
      body.bookId,
      " New copies available: ",
      book.availableCopies,
    );

    console.log(
      "Creating issue for book id: ",
      body.bookId,
      " to user: ",
      toUser.email,
      " by user: ",
      user.email,
      " due date: ",
      body.dueDate,
    );
    const newIssue = await Issue.create(
      {
        book: body.bookId,
        toUser: toUser._id,
        byUser: user._id,
        dueDate: body.dueDate,
      },
      { session },
    );
    await session.commitTransaction();
    return newIssue;
  } catch (error) {
    await session.abortTransaction();
    console.error("Error creating issue: ", error);
    throw error;
  } finally {
    session.endSession();
  }
};

export const returnIssueService = async (issueId) => {
  console.log("Return Issue Service called ", { issueId });
  const session = await mongoose.startSession();
  session.startTransaction();
  try {

    const issue = await Issue.findOneAndUpdate(
      {
        _id: issueId,
        status: "issued",
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
      console.error("Book not found with id: ", issue.book);
      throw new Error("Book not found");
    }

    await session.commitTransaction();
    return issue;
  } catch (error) {
    await session.abortTransaction();
    console.error("Error returning issue: ", error);
    throw error;
  } finally {
    console.log("Ending session for return issue service");
    session.endSession();
  }
};

export const getUserIssuesService = async (userId) => {
  console.log("Get User Issues Service called for userId: ", userId);
  const issues = await Issue.find({ toUser: userId })
    .populate("book", "title author")
    .populate("byUser", "name email")
    .sort({ issueDate: -1 });

  return issues;
};

export const getOverdueIssuesService = async () => {
  console.log("Get Overdue Issues Service called");
  const now = new Date();
  const overdueIssues = await Issue.find({
    dueDate: { $lt: now },
    status: "overdue",
  })
    .populate("book", "title author")
    .populate("toUser", "name email")
    .populate("byUser", "name email");

  console.log("Overdue issues found: ", overdueIssues.length);
  return overdueIssues;
};


export const getAllIssuesService = async () => {
  console.log("Get All Issues Service called");
  const issues = await Issue.find()
    .populate("book", "title author")
    .populate("toUser", "name email")
    .populate("byUser", "name email")
    .sort({ issueDate: -1 });

  return issues;
};

export const getIssueDetailsService = async (issueId) => {
  console.log("Get Issue Details Service called for issueId: ", issueId);
  const issue = await Issue.findById(issueId)
    .populate("book", "title author")
    .populate("toUser", "name email")
    .populate("byUser", "name email");

  return issue;
};

export const extendDueDateService = async (issueId, newDueDate) => {
  const issue = await Issue.findOneAndUpdate(
    { _id: issueId, status: "issued" },
    { $set: { dueDate: newDueDate } },
    { new: true }
  );

  if (!issue) {
    throw new Error("Active issue not found");
  }

  return issue;
};


export const getBookIssueHistoryService = async (bookId) => {
  console.log("Get Book Issue History Service called for bookId: ", bookId);
  const issueHistory = await Issue.find({ book: bookId })
    .populate("toUser", "name email")
    .populate("byUser", "name email")
    .sort({ book: 1,issueDate: -1 });

    return issueHistory;
};

export const getIssuesbySearchService = async (searchTerm) => {
    console.log("Get Issues by Search Service called for searchTerm: ", searchTerm);
  const issues = await Issue.find(
    { $text: { $search: searchTerm } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .populate("book", "title author")
    .populate("toUser", "name email")
    .populate("byUser", "name email")
    .lean();

  return issues;
};