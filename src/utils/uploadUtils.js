import cloundinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadProfilePic = async () => {
    try {
        const result = await new Promise((resolve, reject) => {
            cloundinary.uploader.upload_stream({
                folder: "Librams/profile_pics",
                resource_type: "image",
            }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
        fs.unlinkSync(filePath);
        return result.secure_url;
    } catch (error) {
        console.error("Error uploading profile picture: ", error);
        throw new Error("Failed to upload profile picture");
    }

}

export const uploadContent = async () => {
    try {
        const result = await new Promise((resolve, reject) => {
            cloundinary.uploader.upload_stream({
                folder: `Librams/Books`,
            }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
        fs.unlinkSync(filePath);
        return result.secure_url;
    } catch (error) {
        console.error("Error uploading content: ", error);
        throw new Error("Failed to upload content");
    }   

}