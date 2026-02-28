import z from "zod";

const objectId = z.string().length(24, "Invalid identifier");
const futureDate = z.string().refine((dateStr) => {
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) && date > new Date();
}, "Invalid date. Must be a future date.");

export const IssueBookSchema = z.object({
  body: z.object({
    isbn: z.string().min(3, "ISBN is required"),
    toUserEmail: z.string().email("Invalid email"),
    dueDate: futureDate,
  }).strict(),
});

export const returnIssueSchema = z.object({
  params: z.object({
    id: objectId,
  }).strict(),
});

export const extendDueDateSchema = z.object({
  params: z.object({
    id: objectId,
  }).strict(),
  body: z.object({
    newDueDate: futureDate,
  }).strict(),
});

export const getUserIssuesSchema = z.object({
  query: z.object({
    userId: objectId.optional(),
  }).strict(),
});

export const getIssueDetailsSchema = z.object({
  params: z.object({
    id: objectId,
  }).strict(),
});

export const getBookIssueHistorySchema = z.object({
  params: z.object({
    bookId: objectId,
  }).strict(),
});

export const getIssuesBySearchSchema = z.object({
  query: z.object({
    searchTerm: z.string().min(1, "Search term required"),
  }).strict(),
});