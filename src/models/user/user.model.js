import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneno: {
      type: Number,
      required: [true, "Phone number is required"],
      trim: true,
      unique: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Agent", "User"],
      default: "User",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPassWordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAcessToken = async function () {
  const token = await jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullname: this.fullname,
      address: this.address,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  return token;
};

export const User = mongoose.model("User", userSchema);
