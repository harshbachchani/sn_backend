import mongoose, { Schema } from "mongoose";

const loanSchema = new Schema(
  {
    userDetails: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    accountDetails: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    guarantorDetails: {
      type: Schema.Types.ObjectId,
      ref: "Guarantor",
    },
    loanId:{
      type:Schema.Types.ObjectId,
      ref: "AllLoans",
    },
    status: {
      type: String,
      enum: ["Active", "Closed"],
    },
  },
  { timestamps: true, discriminatorKey: "type" }
);

// loanType: {
//   type: String,
//   enum: ["Personal", "Property", "Business", "Instant", "Micro Finance"],
//   required: [true, "Loan Type is required"],
// },
export const Loan = mongoose.model("Loan", loanSchema);
