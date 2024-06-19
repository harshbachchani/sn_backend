import { Schema } from "mongoose";
import { Loan } from "./loan.model.js";

const personalSchema = new Schema(
  {
    requestedAmount: {
      type: Number,
      required: [true, "Requested Amount is required"],
    },
  },
  {
    timestamps: true,
  }
);

export const PersonalLoan = Loan.discriminator("personalloan", personalSchema);
