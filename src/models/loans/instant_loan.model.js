import { Schema } from "mongoose";
import { Loan } from "./loan.model";

const instantSchema = new Schema(
  {
    purpose: {
      type: String,
      required: [true, "Purpose is required"],
    },
    currentIncome: {
      type: Number,
      required: [true, "Requested Amount is required"],
    },
  },
  { timestamps: true }
);

export const InstantLoan = Loan.discriminator("InstantLoan", instantSchema);
