import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Ensures that every protected request includes a valid JWT before reaching any controller logic.
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.info(`[AuthMiddleware] Authenticating ${req.method} ${req.originalUrl}`);

    if (!authHeader) {
        console.warn("[AuthMiddleware] Missing authorization header");
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1] || authHeader.split("=")[1] || authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("[AuthMiddleware] Invalid token", error.message);
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid token",
        });
    }
};

// Guards a route by ensuring the authenticated user owns any of the allowed roles.
export const rolesMiddleware = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const userRole = await User.findById(req.user.userId).select("role");
            console.info(`[RolesMiddleware] Checking roles for user ${req.user.userId}`);

            if (!userRole || !allowedRoles.includes(userRole.role)) {
                console.warn("[RolesMiddleware] Access denied", {
                    userId: req.user.userId,
                    role: userRole?.role,
                });
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: You don't have permission to access this resource",
                });
            }

            next();
        } catch (error) {
            console.error("[RolesMiddleware] Failed to resolve user role", error.message);
            return res.status(500).json({ success: false, message: "Unable to verify user role" });
        }
    };
};

// Validates request payloads (body, params, query) against the provided Zod schema.
export const validateSchema = (schema) => {
    return (req, res, next) => {
        const parsedResult = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query,
        });

        if (!parsedResult.success) {
            const [firstIssue] = parsedResult.error.errors;
            console.warn("[ValidateSchema] Validation failed", firstIssue?.message);
            return res.status(400).json({
                success: false,
                message: firstIssue?.message || "Invalid request payload",
            });
        }

        req.validated = parsedResult.data;
        next();
    };
};