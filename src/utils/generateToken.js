import jwt from "jsonwebtoken";

export const tempToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "10m",
    });
}

export const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
}

export default generateToken;
