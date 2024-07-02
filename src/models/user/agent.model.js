import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const agentSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
    },
    phoneNo: {
      type: Number,
      required: [true, "Phone number is required"],
      trim: true,
      unique: true,
      index: true,
    },
    dob: {
      type: Date,
      required: [true, "Date is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["Agent", "Admin"],
      default: "Agent",
    },
    panNo: {
      type: String,
      required: [true, "Pan number is required"],
      unique: true,
    },
    aadharNo: {
      type: String,
      required: [true, "Aadhar number is required"],
      unique: true,
    },
    voterId: {
      type: String,
      required: [true, "Aadhar number is required"],
      unique: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

agentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

agentSchema.methods.isPassWordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

agentSchema.methods.generateAcessToken = async function () {
  const token = await jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullname: this.fullname,
      dob: this.dob,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  return token;
};
agentSchema.methods.generateRefreshToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
export const Agent = mongoose.model("Agent", agentSchema);
