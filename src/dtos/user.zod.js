import { z } from "zod";

const emailField = z.email("Invalid email address");

export const signupSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters long"),
        email: emailField,
        password: z.string().min(6, "Password must be at least 6 characters long"),
    }).strict(),
});

export const createUserSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters long"),
        email: emailField,
        password: z.string().min(6, "Password must be at least 6 characters long"),
        role: z.enum(["admin", "staff", "student"]).default("student"),
    }).strict(),
});

export const loginSchema = z.object({
    body: z.object({
        email: emailField,
        password: z.string().min(6, "Password must be at least 6 characters long"),
    }).strict(),
});

export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters long").optional(),
        profilePic: z.string().optional(),
    }).strict(),
});

export const deleteUserSchema = z.object({
    body: z.object({
        userId: z.string().length(24, "Invalid user id"),
    }).strict(),
});

export const resetPasswordSchema = z.object({
    body: z.object({
        email: emailField,
        newPassword: z.string().min(6, "New password must be at least 6 characters long"),
    }).strict(),
});