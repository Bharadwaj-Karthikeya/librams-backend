import e from "express";
import z from  "zod";

export const IssueBookSchema = z.object({
    bookId: z.string().length(24, "Invalid book ID"),
    toUserId: z.string().length(24, "Invalid user ID"),
    dueDate: z.string().refine((dateStr) => {
        const date = new Date(dateStr);
        return !isNaN(date.getTime()) && date > new Date();
    }, "Invalid due date. Must be a valid date string in the future."),
});

export const ExtendDueDateSchema = z.object({
    newDueDate: z.string().refine((dateStr) => {
        const date = new Date(dateStr);
        return !isNaN(date.getTime()) && date > new Date();
    }
    , "Invalid new due date. Must be a valid date string in the future."),
});

export const returnIssueSchema = z.object({
    issueId: z.string().length(24, "Invalid issue ID"),
});

export const getUserIssuesSchema = z.object({
    userId: z.string().length(24, "Invalid user ID"),
});

export const extendDueDateSchema = z.object({
    issueId: z.string().length(24, "Invalid issue ID"),
    newDueDate: z.string().refine((dateStr) => {
        const date = new Date(dateStr);
        return !isNaN(date.getTime()) && date > new Date();
    }, "Invalid new due date. Must be a valid date string in the future."),
});

