import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      index: true,
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
      index: true,
    },
    publishedYear: {
      type: Number,
      min: 0,
    },
    copies: {
      type: Number,
      default: 1,
    },
    availableCopies: {
      type: Number,
      default: 1,
      index: true,
    },
    bookCover: {
      type: String,
      default: "https://via.placeholder.com/150x200?text=No+Cover",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isAvailableforIssue: {
        type: Boolean,
        default: true,
    }
  },
  { timestamps: true },
);

bookSchema.index({
  title: "text",
  author: "text",
  category: "text",
  description: "text",
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
