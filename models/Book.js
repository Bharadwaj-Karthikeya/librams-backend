import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    isbn: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    copies: {
        type: Number,
        default: 1,
    },
    available: {
        type: Boolean,
        default: true,
        index: true,
    },
}, { timestamps: true });

const Book = mongoose.model("Book", bookSchema);

export default Book;