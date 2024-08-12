import { Schema } from "mongoose";
import { Loan } from "./loan.model.js";

const partnerBusinessSchema = new Schema(
  {
    companyName: {
      type: String,
      required: [true, "Purpose is required"],
    },
    emailId: {
      type: Number,
      required: [true, "emailId is required"],
    },
    panCardNumber: {
      type: Number,
      required: [true, "panCardNumber is required"],
    },
    officePin: {
      type: Number,
      required: [true, "officePin is required"],
    },
    currentIndustry: {
      type: String,
      required: [true, "currentIndustry is required"],
    },
    netProfitAmount: {
      type: Number,
      required: [true, "netProfitAmount is required"],
    },
    yearsInCurrentBusiness: {
      type: Number,
      required: [true, "yearsInCurrentBusiness is required"],
    },
    companyPhoneNo: {
      type: Number,
      required: [true, "companyPhoneNo is required"],
    },
    purpose: {
      type: String,
      required: [true, "purpose is required"],
    },
    GSTnumber: {
      type: Number,
      required: [true, "GSTnumber is required"],
    },
    udhyamMSMENumber: {
      type: Number,
      required: [true, "udhyamMSMENumber is required"],
    },
  },
  { timestamps: true }
);

export const PartnerBusinessLoan = Loan.discriminator(
  "PartnerBusinessLoan",
  partnerBusinessSchema
);
