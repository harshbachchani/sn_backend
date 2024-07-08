import mongoose, { Schema } from "mongoose";

const schemeSchema = new Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    tenure: {
      type: Number,
      required: [true, "Tenure is required"],
    },
    maturityAmount: {
      type: Number,
    },
    schemeType: {
      type: String,
      enum: ["Monthly", "Recurring", "Fixed", "Daily"],
      required: [true, "Scheme Type is required"],
    },
    nominee: {
      type: mongoose.Types.ObjectId,
      ref: "Nominee",
      required: [true, "Nominee is required"],
    },
    account: {
      type: mongoose.Types.ObjectId,
      ref: "Account",
      required: [true, "Account is required"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
  },
  { timestamps: true }
);
export const Scheme = mongoose.model("Scheme", schemeSchema);
