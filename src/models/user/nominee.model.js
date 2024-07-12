import mongoose, { Schema } from "mongoose";

const nomineeSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    panNo: {
      type: String,
      required: [true, "Pan number is required"],
      trim: true,
      unique: true,
      index: true,
    },
    relation: {
      type: String,
      required: [true, "Relation is required"],
      trim: true,
    },
    dob: {
      type: Date,
      required: [true, "DOB of nominee is required"],
    },
    phoneNo: {
      type: Number,
      required: [true, "Phone number is required"],
      trim: true,
      unique: true,
      index: true,
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

export const Nominee = mongoose.model("Nominee", nomineeSchema);
