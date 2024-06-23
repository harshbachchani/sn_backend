import mongoose, { Schema } from "mongoose";

const accountSchema = new Schema(
  {
    address1: {
      type: String,
      required: [true, "Address Line 1 is required"],
    },
    address2: {
      type: String,
      required: [true, "Address Line 2 is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    zip: {
      type: String,
      required: [true, "Zip Code is required"],
    },
    emp_type: {
      type: String,
      enum: ["Salaried", "Self Employed"],
      required: [true, "Employment Type is required"],
    },
    income: {
      type: String,
      enum: ["Below 2 Lakhs", "2-5 Lakhs", "5-10 Lakhs", "Above 10 Lakhs"],
      required: [true, "Income is required"],
    },
    panno: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: [true, "Pan no is required"],
    },
    aadharno: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: [true, "Aadhar no is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Account = mongoose.model("Account", accountSchema);
