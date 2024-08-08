import { Schema } from "mongoose";
import { Loan } from "./loan.model.js";
const microFinanceSchema = new Schema(
  {
    shopname: {
      type: String,
      required: [true, "Shop name is required"],
    },
    natureofbusiness: {
      type: String,
      required: [true, "Nature of Business is required"],
    },
    ageofbusiness: {
      type: Number,
      required: [true, "Age of business is required"],
    },
    monthlyincome: {
      type: Number,
      required: [true, "Monthly income is required"],
    },
    shopaddress: {
      type: String,
      required: [true, "Shop address is required"],
    },
    presentAddress: {
      type: String,
    },
    yearInBusiness: {
      type: Number,
      required: [true, "Years required"],
    },
  },
  {
    timestamps: true,
  }
);

export const MicroFinanceLoan = Loan.discriminator(
  "microfinanceloan",
  microFinanceSchema
);
