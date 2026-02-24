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

export const issueBook = async (req, res) => {
    try {
        const result = await IssueBookService({ user: req.user, body: req.body });
        res.status(201).json(result);
    } catch (error) {
        console.error("Error in issueBookController: ", error);
        res.status(400).json({ error: error.message });
    }
}

export const returnIssue = async (req, res) => {
    try {
        const result = await returnIssueService(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in returnIssueController: ", error);
        res.status(400).json({ error: error.message });
    }
}

export const getOverdueIssues = async (req, res) => {
    try {
        const result = await getOverdueIssuesService();
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in getOverdueIssuesController: ", error);
        res.status(400).json({ error: error.message });
    }
}

export const getUserIssues = async (req, res) => {
    try {
        const result = await getUserIssuesService(req.user._id);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in getUserIssuesController: ", error);
        res.status(400).json({ error: error.message });
    }
}

export const extendDueDate = async (req, res) => {
    try {
        const result = await extendDueDateService(req.params.id, req.body.newDueDate);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in extendDueDateController: ", error);
        res.status(400).json({ error: error.message });
    }
}

export const getAllIssues = async (req, res) => {
    try {
        const result = await getAllIssuesService();
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in getAllIssuesController: ", error);
        res.status(400).json({ error: error.message });
    }
}

export const getIssueDetails = async (req, res) => {
    try {
        const result = await getIssueDetailsService(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in getIssueDetailsController: ", error);
        res.status(400).json({ error: error.message });
    }
}

export const getBookIssueHistory = async (req, res) => {
    try {
        const result = await getBookIssueHistoryService(req.params.bookId);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in getBookIssueHistoryController: ", error);
        res.status(400).json({ error: error.message });
    }
}

export const getIssuesbySearch = async (req, res) => {
    try {
        const result = await getIssuesbySearchService(req.query.searchTerm);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in getIssuesbySearchController: ", error);
        res.status(400).json({ error: error.message });
    }
}