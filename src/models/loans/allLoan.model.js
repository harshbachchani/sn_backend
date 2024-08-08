import mongoose, { Schema } from "mongoose";

const allLoanSchema = new Schema(
  {
    type: {
      type: String,
      required: [true, "Loan type required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    tenure: {
      type: Number,
      required: [true, "Tenure is required"],
    },
    enddate: {
      type: Date,
    },
    purpose: {
      type: String,
      required: [true, "Purpose of Loan is required"],
      trim: true,
    },
    // status: {
    //   type: String,
    //   enum: ["Active", "Closed"],
    // },
    // user: {
    //   type: Schema.Types.ObjectId,
    //   ref: "User",
    // },
  },
  { timestamps: true }
);

// loanType: {
//   type: String,
//   enum: ["Personal", "Property", "Business", "Instant", "Micro Finance"],
//   required: [true, "Loan Type is required"],
// },
export const AllLoans = mongoose.model("AllLoans", allLoanSchema);
