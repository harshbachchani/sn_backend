import mongoose, { Schema } from "mongoose";
{
}

const guarantorSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    phoneNo: {
      type: Number,
      required: [true, "Phone No is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    loan: {
      type: Schema.Types.ObjectId,
      ref: "Loan",
    },
  },
  { timestamps: true }
);

export const Guarantor = mongoose.model("Guarantor", guarantorSchema);
