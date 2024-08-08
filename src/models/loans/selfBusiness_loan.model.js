import { Schema } from "mongoose";
import { Loan } from "./loan.model";

const selfBusinessSchema = new Schema(
  {
    businessType: {
      type: String,
      required: [true, "Purpose is required"],
    },
    netProfitAmount: {
      type: Number,
      required: [true, "Requested Amount is required"],
    },
    officePin: {
      type: Number,
      required: [true, "Requested Amount is required"],
    },
    panCardNumber: {
      type: Number,
      required: [true, "Requested Amount is required"],
    },
    businessEmail: {
      type: String,
      required: [true, "Requested Amount is required"],
    },
    GSTnumber: {
      type: Number,
      required: [true, "Requested Amount is required"],
    },
    udhyamMSMENumber: {
      type: Number,
      required: [true, "Requested Amount is required"],
    },
  },
  { timestamps: true }
);

export const SelfBusinessLoan = Loan.discriminator("SelfBusinessLoan", selfBusinessSchema);
