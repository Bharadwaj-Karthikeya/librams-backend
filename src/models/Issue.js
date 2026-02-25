import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    byUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
      index: true,
    },
    returnedDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["issued", "returned", "overdue"],
      default: "issued",
      index: true,
    },
  },
  { timestamps: true },
);

issueSchema.index({ book: 1, toUser: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "issued" } }
);

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;
