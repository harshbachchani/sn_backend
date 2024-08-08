import { Schema } from "mongoose";
import { Loan } from "./loan.model.js";

const propertySchema = new Schema(
  {
    propertyType: {
      type: String,
      required: [true, "Property Type is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Propery address is required"],
      trim: true,
    },
    price: {
      type: String,
      required: [true, "Propery Value is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

export const PropertyLoan = Loan.discriminator("PropertyLoan", propertySchema);
