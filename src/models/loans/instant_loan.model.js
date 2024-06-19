import { Schema } from "mongoose";
import { Loan } from "./loan.model";

const instantSchema = new Schema(
  {
    requestedAmount: {
      type: Number,
      required: [true, "Requested Amount is required"],
    },
    guarantor: {
      type: Schema.Types.ObjectId,
      ref: "Guarantor",
    },
  },
  { timestamps: true }
);

export const InstantLoan = Loan.discriminator("instantloan", instantSchema);
