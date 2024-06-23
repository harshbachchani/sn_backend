import { asyncHandler } from "../utils/asynHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user/user.model.js";
import { sendOtp, verifyOtp } from "../utils/twilio.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accesstoken = await user.generateAcessToken();
    const refreshtoken = await user.generateRefreshToken();
    return { accesstoken, refreshtoken };
  } catch (err) {
    console.log(err);
    throw new ApiError(
      500,
      "Something Went Wrong while generating access and refresh token"
    );
  }
};
const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, phoneno, dob } = req.body;
  if (
    [fullname, email, phoneno].some((field) => field?.trim() === "") ||
    !(fullname, email, phoneno)
  ) {
    throw new ApiError(400, "All fields are required");
  }
  if (!dob) throw new ApiError(400, "DOB is required");

  try {
    const user = await User.findOneAndUpdate(
      { phoneno },
      { fullname, email, dob, phoneno, verified: false },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const result = await sendOtp(phoneno);
    if (result.success) {
      res.status(200).json(new ApiResponse(200, "", "OTP sent successfully"));
    } else {
      throw new ApiError(400, "Failed to send OTP");
    }
  } catch (error) {
    console.error(`Failed to send OTP: ${error.message}`);
    throw new ApiError(500, "Failed to send OTP");
  }
});

const verifyUserOtp = asyncHandler(async (req, res) => {
  const { phoneno, otp } = req.body;
  if (!(otp || phoneno)) {
    throw new ApiError(401, "OTP and phoneno are required");
  }
  try {
    const user = await User.findOne({ phoneno }).select(
      "-refreshtoken -verified"
    );

    if (!user) {
      throw new ApiError(400, "User not found");
    }
    const result = await verifyOtp(phoneno, otp);
    if (!result.success) {
      throw new ApiError(400, "Failed to verify OTP");
    }
    if (result.verficationcheck.status === "approved") {
      const { accesstoken, refreshtoken } = await generateAccessAndRefreshToken(
        user._id
      );
      await User.findByIdAndUpdate(
        user._id,
        { verified: true, refreshToken: refreshtoken },
        { new: true, runValidators: true }
      );
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { user, accesstoken },
            "User Registered Successfully"
          )
        );
    } else {
      throw new ApiError(400, "Invalid OTP");
    }
  } catch (error) {
    console.error(`Failed to verify OTP: ${error}`);
    throw new ApiError(500, error);
  }
});

const resendOtp = asyncHandler(async (req, res) => {
  const { phoneno } = req.body;
  if (!phoneno) {
    throw new ApiError(401, "Phone no. is required");
  }
  const result = await sendOtp(phoneno);
  if (result.success) {
    res.status(200).json(new ApiResponse(200, "", "OTP Resent successfully"));
  } else {
    throw new ApiError(400, "Failed to send OTP");
  }
});

const createAccount = asyncHandler(async (req, res) => {
  const { address1, address2, city, state, zip, emp_type, income } = req.body;
  res.json({ data: req?.user });
});
export { registerUser, verifyUserOtp, resendOtp, createAccount };
