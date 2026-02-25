import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "staff", "student"],
      default: "student",
      index: true,
    },
    profilePicture: {
      type: String,
      default: "https://via.placeholder.com/150?text=No+Profile",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
