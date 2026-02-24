import z from "zod";

export const IssueBookSchema = z.object({
  body: z.object({
    bookId: z.string().length(24, "Invalid book ID"),
    toUserEmail: z.string().email("Invalid email"),
    dueDate: z.string().refine((dateStr) => {
      const date = new Date(dateStr);
      return !isNaN(date.getTime()) && date > new Date();
    }, "Invalid due date. Must be future date."),
  }).strict(),
});

export const returnIssueSchema = z.object({
  params: z.object({
    id: z.string().length(24, "Invalid issue ID"),
  }),
});

export const extendDueDateSchema = z.object({
  params: z.object({
    id: z.string().length(24, "Invalid issue ID"),
  }),
  body: z.object({
    newDueDate: z.string().refine((dateStr) => {
      const date = new Date(dateStr);
      return !isNaN(date.getTime()) && date > new Date();
    }, "Invalid new due date. Must be future date."),
  }).strict(),
});

export const getIssuesBySearchSchema = z.object({
  query: z.object({
    searchTerm: z.string().min(1, "Search term required"),
  }),
});