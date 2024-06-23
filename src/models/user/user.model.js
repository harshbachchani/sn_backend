import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
  {
    fullname: {
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
    phoneno: {
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

    verified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
  },
  { timestamps: true }
);

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// userSchema.methods.isPassWordCorrect = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

userSchema.methods.generateAcessToken = async function () {
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
userSchema.methods.generateRefreshToken = async function () {
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
export const User = mongoose.model("User", userSchema);
