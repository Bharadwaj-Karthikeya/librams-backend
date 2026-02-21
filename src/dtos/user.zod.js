import {z} from "zod";

export const createUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["admin", "staff", "student"]).default("student"),
    profilePic: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const verifyUserSchema = z.object({
    email: z.email("Invalid email address"),
    otp: z.string().length(6, "OTP must be 6 characters long"),
});

export const requestOtpSchema = z.object({
    email: z.email("Invalid email address").nonoptional(),
});
