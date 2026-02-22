import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization; 
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    const token = authHeader.split(" ")[1] || authHeader.split("=")[1] || authHeader;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Invalid token: ", error);
        
        return res.status(401).json({
            success: false, 
            message: "Unauthorized: Invalid token" 
        });
    }

}

export const rolesMiddleware = (allowedRoles) => {
    return async (req, res, next) => {
        const userRole = await User.findById(req.user.userId).select("role");
        console.log("User role: ", userRole, req.user);
        if (!allowedRoles.includes(userRole.role)) {
            return res.status(403).json({ 
                success: false,
                message: "Forbidden: You don't have permission to access this resource"
            });
        }
        next();
    }
}

export const validateSchema = (schema) => {
    return (req, res, next) => {
        const { error } = schema.parse(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }
        next();
    };
}