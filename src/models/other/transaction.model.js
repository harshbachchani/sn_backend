import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required in transaction"],
    },
    type: {
      type: String,
      required: [true, "Type is required in transaction"],
      enum: ["Debit", "Credit"],
      index: true,
    },
    transactionType: {
      type: String,
      index: true,
      enum: ["Scheme", "Loan"],
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
  },
  { timestamps: true }
);
export const Transaction = mongoose.model("Transaction", transactionSchema);
