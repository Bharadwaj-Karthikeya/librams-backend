import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1] || authHeader.split("=")[1];
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