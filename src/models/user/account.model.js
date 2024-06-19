import mongoose, { Schema } from "mongoose";

const accountSchema = new Schema(
  {
    account_no: {
      type: Number,
      required: [true, "Account number is required"],
      trim: true,
      index: true,
    },
    marital_status: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
      required: [true, "Marital Status is required"],
    },
    income: {
      type: String,
      enum: ["Below 2 Lakhs", "2-5 Lakhs", "5-10 Lakhs", "Above 10 Lakhs"],
      required: [true, "Income is required"],
    },
    emp_type: {
      type: String,
      enum: ["Salaried", "Self Employed"],
      required: [true, "Employment Type is required"],
    },
    major_source_of_income: {
      type: String,
      required: [true, "Major Source of income is required"],
    },
    father_name: {
      type: String,
      required: [true, "Father's Name is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    address: {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },
  },
  { timestamps: true }
);

export const Account = mongoose.model("Account", accountSchema);
