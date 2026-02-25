import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

const streamUpload = (file, options) => {
    if (!file) {
        return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });

        Readable.from(file.buffer).pipe(uploadStream);
    });
};

// Uploads profile pictures to the dedicated Cloudinary folder.
export const uploadProfilePic = async (file) => {
    try {
        const result = await streamUpload(file, {
            folder: "Librams/profile_pics",
            resource_type: "image",
        });
        return result?.secure_url ?? null;
    } catch (error) {
        console.error("Error uploading profile picture", error.message);
        throw new Error("Failed to upload profile picture");
    }
};

// Uploads generic content (covers, documents, etc.).
export const uploadContent = async (file, folder = "Librams/Books") => {
    try {
        const result = await streamUpload(file, {
            folder,
            resource_type: "auto",
        });
        return result?.secure_url ?? null;
    } catch (error) {
        console.error("Error uploading content", error.message);
        throw new Error("Failed to upload content");
    }
};