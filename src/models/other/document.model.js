import mongoose, { Schema } from "mongoose";
const documentSchema = new Schema(
  {
    docno: {
      type: String,
      required: [true, "Document Number is required"],
      unique: true,
    },
    type: {
      type: String,
      required: [true, "Document Type is required"],
    },
    url: {
      type: String,
      required: [true, "Document URL is required"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Document = mongoose.model("Document", documentSchema);
