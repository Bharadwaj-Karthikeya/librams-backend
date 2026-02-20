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

    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("Password hashed successfully");

    const newUser = await User.create({
        name : name,
        email : email,
        password : hashedPassword,
        role : role,
        profilePic : profilePic ? await cloudinary.uploader.upload(profilePic, { folder: "librams/profile_pics" }).then(result => result.secure_url) : undefined,
    });

    console.log("User created successfully: ", newUser);

    return newUser;
}