import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    type: {
      type: String,
      index: true,
      enum: ["Scheme", "Loan", "Saving", "Overdue"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    accountId: {
      type: mongoose.Types.ObjectId,
      ref: "Account",
    },
    schemeId: {
      type: mongoose.Types.ObjectId,
      ref: "Scheme",
    },
    loanId: {
      type: mongoose.Types.ObjectId,
      ref: "Loan",
    },
    role: {
      type: String,
      enum: ["User", "Agent", "Admin"],
      index: true,
      required: [true, "Role of notification is required"],
    },
  },
  { timestamps: true }
);
export const Notification = mongoose.model("Notification", notificationSchema);
