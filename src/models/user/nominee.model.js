import mongoose, { Schema } from "mongoose";

const nomineeSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    aadharNo: {
      type: Number,
      required: [true, "Aadhar number is required"],
      trim: true,
      unique: true,
      index: true,
    },
    phoneNo: {
      type: Number,
      required: [true, "Phone number is required"],
      trim: true,
      unique: true,
      index: true,
    },
    accountNo: {
      type: mongoose.Types.ObjectId,
      ref: "Account",
      required: [true, "Account number is required"],
    },
    relation: {
      type: String,
      required: [true, "Relation is required"],
      trim: true,
    },
    ifsc: {
      type: String,
      required: [true, "IFSC code is required"],
      trim: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    scheme: {
      type: mongoose.Types.ObjectId,
      ref: "Scheme",
    },
  },
  { timestamps: true }
);

export const nominee = mongoose.model("Nominee", nomineeSchema);
