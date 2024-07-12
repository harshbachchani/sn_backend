import mongoose, { Schema } from "mongoose";

const schemeSchema = new Schema({
  payableAmount: {
    type: Number,
    required: [true, "payable Amount is required"],
  },
  tenure: {
    type: Date,
    required: [true, "Tenure is required"],
  },
  maturityAmount: {
    type: Number,
    required: [true, "Maturity Amount is required"],
  },
  statement: {
    type: Buffer,
    required: [true, "Bank Statement is required"],
  },
  type: {
    type: String,
    enum: ["Monthly", "Recurring", "Fixed", "Weekly"],
    required: [true, "Scheme Type is required"],
  },
  totalAmount: {
    //total amount user has paid so far
    type: Number,
    default: 0,
  },
  remainingAmount: {
    //remaining amount user has to pay
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["Active", "Completed", "Pending", "Overdue"],
    default: "Pending",
  },
  penalty: Number,
  purpose: String,
  monthlyIncome: Number,
  schemeStartDate: Date,
  schemeEndDate: Date,
  nextPaymentDueDate: Date,
  nomineeId: {
    type: mongoose.Types.ObjectId,
    ref: "Nominee",
  },
  accountId: {
    type: mongoose.Types.ObjectId,
    ref: "Account",
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});
export const Scheme = mongoose.model("Scheme", schemeSchema);
