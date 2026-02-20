import { signupService } from "../services/auth.service.js";

export const signup = async (req, res) => {
    try {
        const newUser = await signupService(req.body);
        
        res.status(201).json({ 
            success: true, 
            message: "User created successfully", 
            user: newUser 
        });


    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}