import multer from "multer";

const  storage = multer.memoryStorage();

export const uploadPsize = multer({ 
    storage, 
    limits: { 
        fileSize: 5 * 1024 * 1024 
    } 
}); // Limit file size to 5MB

export const uploadCSize = multer({ 
    storage, 
    limits: { 
        fileSize: 10 * 1024 * 1024 
    } 
}); // Limit file size to 10MB