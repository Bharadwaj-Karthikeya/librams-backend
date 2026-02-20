import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";


export const signupService = async ({name, email, password, role, profilePic}) => {
    console.log("Signup Service called ", {name, email, password, role, profilePic});
    
    if (!name || !email || !password) {
        console.error("Missing required fields name, email, or password");
        throw new Error("Name, email, and password are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        console.error("User with this email already exists: ", email);
        throw new Error("User with this email already exists");
    }

    

    return newUser;
}