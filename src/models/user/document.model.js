import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const documentSchema = new Schema(
  {
    docno: {
      type: String,
      required: [true, "Document Number is required"],
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

documentSchema.pre("save", async function (next) {
  if (!this.isModified("docno")) return next();
  this.docno = await bcrypt.hash(this.docno, 10);
  next();
});

documentSchema.methods.isDocMatch = async function (docno) {
  return await bcrypt.compare(docno, this.docno);
};

export const Document = mongoose.model("Document", documentSchema);
