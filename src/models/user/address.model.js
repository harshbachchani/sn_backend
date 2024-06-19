import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema(
  {
    house_no: {
      type: String,
      required: [true, "House No. is Required"],
      trim: true,
    },

    village: {
      type: String,
      required: [true, "Village is Required"],
      trim: true,
    },

    mandal: {
      type: String,
      required: [true, "Mandal is Required"],
      trim: true,
    },

    district: {
      type: String,
      required: [true, "District is Required"],
      trim: true,
    },
    pincode: {
      type: Number,
      required: [true, "Pincode is Required"],
      trim: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    account: {
      type: mongoose.Types.ObjectId,
      ref: "Account",
    },
  },
  { timestamps: true }
);

export const Address = mongoose.model("Address", addressSchema);
