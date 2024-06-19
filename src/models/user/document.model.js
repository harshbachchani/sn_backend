import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const documentSchema = new Schema(
  {
    doc_id: {
      type: String,
      required: [true, "Document Id is required"],
    },
    doc_type: {
      type: String,
      required: [true, "Document Type is required"],
      trim: true,
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
  if (!this.isModified("doc_id")) return next();
  this.doc_id = await bcrypt.hash(this.doc_id, 10);
  next();
});

documentSchema.methods.isDocIdCorrect = async function (doc_id) {
  return await bcrypt.compare(doc_id, this.doc_id);
};

export const Document = mongoose.model("Document", documentSchema);
