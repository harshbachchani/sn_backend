import mongoose, { Schema } from "mongoose";

const loanSchema = new Schema(
  {
    amount: {
      //amount given by bank
      type: Number,
      required: [true, "Amount is required"],
    },
    remainingAmount: {
      //remaining amount user has to pay
      type: Number,
      default: function () {
        return this.amount;
      },
    },
    totalAmount: {
      //total amount user has paid so far
      type: Number,
      default: 0,
    },
    EMI: {
      type: Number,
      required: [true, "EMI is required"],
    },
    penalty: {
      type: Number,
      default: 0,
    },
    tenure: {
      type: Number,
      required: [true, "Tenure is required"],
    },
    purpose: {
      type: String,
      required: [true, "Purpose of Loan is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Closed", "Pending", "Overdue"],
      default: "Pending",
    },
    loanType: {
      type: String,
      enum: ["Personal", "Property", "Business", "Instant", "Micro Finance"],
      required: [true, "Loan Type is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    paymentHistory: [paymentHistorySchema],
    startDate: Date,
    endDate: Date,
    nextPaymentDueDate: Date,
  },
  { timestamps: true, discriminatorKey: "type" }
);

const paymentHistorySchema = new Schema(
  {
    paymentDate: {
      type: Date,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
  },
  { _id: false } // No need for _id for sub-documents
);

loanSchema.methods.calculateRemainingBalance = function () {
  const totalPaid = this.paymentHistory.reduce(
    (sum, payment) => sum + payment.amountPaid,
    0
  );
  this.remainingAmount = this.amount + this.penalty - totalPaid;
  return this.remainingAmount;
};

loanSchema.methods.calculateNextPaymentDueDate = function () {
  const lastPaymentDate =
    this.paymentHistory[this.paymentHistory.length - 1]?.paymentDate ||
    this.startDate;
  const nextDueDate = new Date(lastPaymentDate);
  nextDueDate.setMonth(nextDueDate.getMonth() + 1);
  this.nextPaymentDueDate = nextDueDate;
  return this.nextPaymentDueDate;
};

loanSchema.methods.applyPenalty = function (penaltyAmount) {
  this.penalty += penaltyAmount;
  this.remainingAmount += penaltyAmount;
  return this.penalty;
};
export const Loan = mongoose.model("Loan", loanSchema);
