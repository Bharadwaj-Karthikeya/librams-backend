import express from "express";

import { 
    signup,
        verifyUser,
        createUser,
        login, 
} from "../controllers/auth.controller.js";

import { uploadPsize } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/verify', verifyUser);
router.post('/create', uploadPsize.single("profilePic"), createUser);
router.post('/login', login);

export default router;