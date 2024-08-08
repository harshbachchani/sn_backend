import { Schema } from "mongoose";
import { Loan } from "./loan.model.js";

const personalSchema = new Schema(
  {
    purpose: {
      type: String,
      required: [true, "Purpose is required"],
    },
    currentIncome: {
      type: Number,
      required: [true, "Requested Amount is required"],
    },
    // requestedAmount: {
    // type: Number,
    // required: [true, "Requested Amount is required"],
    // },
  },
  {
    timestamps: true,
  }
);

export const PersonalLoan = Loan.discriminator("PersonalLoan", personalSchema);
