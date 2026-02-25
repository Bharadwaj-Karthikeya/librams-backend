import {
    IssueBookService,
    returnIssueService,
    getUserIssuesService,
    getOverdueIssuesService,
    getAllIssuesService,
    getIssueDetailsService,
    extendDueDateService,
    getBookIssueHistoryService,
    getIssuesbySearchService
} from "../services/issue.service.js";

const getValidated = (req) => req.validated ?? { body: req.body, params: req.params, query: req.query };

// Issues a book to a target user if stock permits.
export const issueBook = async (req, res) => {
    const { body } = getValidated(req);
    console.info("[IssueController] Issue book", { bookId: body.bookId, toUserEmail: body.toUserEmail });
    try {
        const result = await IssueBookService({ userId: req.user.userId, body });
        res.status(201).json(result);
    } catch (error) {
        console.error("[IssueController] Issue book failed", error.message);
        res.status(400).json({ error: error.message });
    }
};

// Marks an issue as returned and restores inventory.
export const returnIssue = async (req, res) => {
    const { params } = getValidated(req);
    console.info("[IssueController] Return issue", { issueId: params.id });
    try {
        const result = await returnIssueService(params.id);
        res.status(200).json(result);
    } catch (error) {
        console.error("[IssueController] Return issue failed", error.message);
        res.status(400).json({ error: error.message });
    }
};

// Lists overdue issues for follow-up.
export const getOverdueIssues = async (_req, res) => {
    console.info("[IssueController] Fetch overdue issues");
    try {
        const result = await getOverdueIssuesService();
        res.status(200).json(result);
    } catch (error) {
        console.error("[IssueController] Overdue issues failed", error.message);
        res.status(400).json({ error: error.message });
    }
};

// Retrieves issues for either the authenticated user or a requested userId (admin/staff).
export const getUserIssues = async (req, res) => {
    const { query } = getValidated(req);
    const allowOverride = req.path.includes("/user");
    const targetUserId = allowOverride && query.userId ? query.userId : req.user.userId;
    console.info("[IssueController] Get user issues", { targetUserId });
    try {
        const result = await getUserIssuesService(targetUserId);
        res.status(200).json(result);
    } catch (error) {
        console.error("[IssueController] Get user issues failed", error.message);
        res.status(400).json({ error: error.message });
    }
};

// Extends the due date for an active issue.
export const extendDueDate = async (req, res) => {
    const { params, body } = getValidated(req);
    console.info("[IssueController] Extend due date", { issueId: params.id });
    try {
        const result = await extendDueDateService(params.id, body.newDueDate);
        res.status(200).json(result);
    } catch (error) {
        console.error("[IssueController] Extend due date failed", error.message);
        res.status(400).json({ error: error.message });
    }
};

// Returns all issue records.
export const getAllIssues = async (_req, res) => {
    console.info("[IssueController] Get all issues");
    try {
        const result = await getAllIssuesService();
        res.status(200).json(result);
    } catch (error) {
        console.error("[IssueController] Get all issues failed", error.message);
        res.status(400).json({ error: error.message });
    }
};

// Returns the detail of a specific issue.
export const getIssueDetails = async (req, res) => {
    const { params } = getValidated(req);
    console.info("[IssueController] Get issue details", { issueId: params.id });
    try {
        const result = await getIssueDetailsService(params.id);
        res.status(200).json(result);
    } catch (error) {
        console.error("[IssueController] Get issue details failed", error.message);
        res.status(400).json({ error: error.message });
    }
};

// Shows issue history for a specific book.
export const getBookIssueHistory = async (req, res) => {
    const { params } = getValidated(req);
    console.info("[IssueController] Get book history", { bookId: params.bookId });
    try {
        const result = await getBookIssueHistoryService(params.bookId);
        res.status(200).json(result);
    } catch (error) {
        console.error("[IssueController] Get book history failed", error.message);
        res.status(400).json({ error: error.message });
    }
};

// Performs a text search across issued books.
export const getIssuesbySearch = async (req, res) => {
    const { query } = getValidated(req);
    console.info("[IssueController] Search issues", { searchTerm: query.searchTerm });
    try {
        const result = await getIssuesbySearchService(query.searchTerm);
        res.status(200).json(result);
    } catch (error) {
        console.error("[IssueController] Search issues failed", error.message);
        res.status(400).json({ error: error.message });
    }
};