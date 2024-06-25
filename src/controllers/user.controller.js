import { asyncHandler } from "../utils/asynHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user/user.model.js";
import { Account } from "../models/user/account.model.js";
import { sendOtp, verifyOtp } from "../utils/twilio.js";
import { Document } from "../models/user/document.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accesstoken = await user.generateAcessToken();
    const refreshtoken = await user.generateRefreshToken();
    return { accesstoken, refreshtoken };
  } catch (err) {
    console.log(err);
    return next(
      new ApiError(
        500,
        "Something Went Wrong while generating access and refresh token"
      )
    );
  }
};
const registerUser = asyncHandler(async (req, res, next) => {
  const { fullname, email, phoneno, dob } = req.body;
  if (
    [fullname, email, phoneno].some((field) => field?.trim() === "") ||
    !(fullname, email, phoneno, dob)
  ) {
    return next(new ApiError(400, "Please fill all the required fields"));
  }

  const xuser = await User.findOne({
    $or: [{ phoneno: phoneno }, { email: email }],
  });
  if (!xuser || (xuser.phoneno == phoneno && xuser.email == email)) {
    try {
      const result = await sendOtp(phoneno);
      if (result.success) {
        const user = await User.findOneAndUpdate(
          { phoneno },
          { fullname, email, dob, phoneno, verified: false },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        if (!user) return next(new ApiError(500, "Cannot create user "));
        res
          .status(200)
          .json(
            new ApiResponse(200, { userId: user._id }, "OTP sent successfully")
          );
      } else {
        return next(new ApiError(400, "Failed to send OTP", result.error));
      }
    } catch (error) {
      console.error(`Failed to send OTP: ${error.message}`);
      return next(new ApiError(500, "Internal Server Error", error));
    }
  } else {
    return next(new ApiError(401, "User phoneno and email do not matched"));
  }
});

const verifyUserOtp = asyncHandler(async (req, res, next) => {
  const { userId, otp } = req.body;
  if (!(otp || userId)) {
    return next(new ApiError(400, "OTP and userId are required"));
  }
  try {
    const user = await User.findById(userId).select("-refreshtoken -verified");

    if (!user) {
      return next(new ApiError(400, "User not found"));
    }
    const result = await verifyOtp(phoneno, otp);
    if (!result.success) {
      return next(new ApiError(500, "Failed to verify OTP"));
    }
    if (result.verficationcheck.status === "approved") {
      const { accesstoken, refreshtoken } = await generateAccessAndRefreshToken(
        user._id
      );
      const newuser = await User.findByIdAndUpdate(
        user._id,
        { verified: true, refreshToken: refreshtoken },
        { new: true, runValidators: true }
      );
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { newuser, accesstoken },
            "User Registered Successfully"
          )
        );
    } else {
      return next(new ApiError(400, "Invalid OTP"));
    }
  } catch (error) {
    console.error(`Failed to verify OTP: ${error}`);
    return next(new ApiError(500, "Internal Server Error", error));
  }
});

const resendOtp = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) return next(new ApiError(400, "UserId is required"));
  const user = await User.findById(userId);
  if (!user) {
    return next(new ApiError(400, "User not found"));
  }
  const result = await sendOtp(phoneno);
  if (result.success) {
    res
      .status(200)
      .json(new ApiResponse(200, phoneno, "OTP Resent successfully"));
  } else {
    return next(new ApiError(500, "Internal Server Error Failed to send OTP"));
  }
});

const refreshAcessToken = asyncHandler(async (req, res, next) => {
  const incomingrefreshtoken = req.body.refreshtoken;
  if (!incomingrefreshtoken) {
    return next(new ApiError(401, "Unauthorized request"));
  }

  try {
    const decodedtoken = await jwt.verify(
      incomingrefreshtoken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const myuser = await User.findById(decodedtoken?._id);
    if (!myuser) return next(new ApiError(401, "Invalid Refresh Token"));
    if (incomingrefreshtoken !== myuser.refreshToken) {
      return next(new ApiError(401, "Refresh token is expired or used"));
    }
    const { accesstoken, refreshtoken } = await generateAccessAndRefreshToken(
      myuser._id
    );
    res.setHeader("Authorization", `Bearer ${accesstoken}`);
    await User.findByIdAndUpdate(myuser._id, { refreshToken: refreshtoken });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { accesstoken, refreshtoken },
          "Access Token refreshed successfully"
        )
      );
  } catch (error) {
    return next(
      new ApiError(401, error?.message || "Invalid Refresh Token", error)
    );
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { phoneno } = req.body;
  if (!phoneno) {
    return next(new ApiError(400, "Phone no is required"));
  }
  const user = await User.findOne({ phoneno });
  if (!user) {
    return next(new ApiError(400, "User not found please register first"));
  }
  try {
    const result = await sendOtp(phoneno);
    if (result.success) {
      res
        .status(200)
        .json(
          new ApiResponse(200, { userId: user._id }, "OTP sent successfully")
        );
    } else {
      return next(new ApiError(400, "Failed to send OTP", result.error));
    }
  } catch (error) {
    return next(new ApiError(500, "Internal Server Error", error));
  }
});

const createAccount = asyncHandler(async (req, res, next) => {
  const {
    address1,
    address2,
    city,
    state,
    zip,
    emp_type,
    income,
    panno,
    aadharno,
    panurl,
    aadharurl,
  } = req.body;
  if (
    !(address1 || address2 || city || state || zip || emp_type || income) ||
    [address1, address2, city, state, zip, emp_type, income].some(
      (field) => field?.trim() === ""
    )
  ) {
    return next(new ApiError(404, "All Fields Are required"));
  }
  if (!(panno || aadharno || panurl || aadharurl))
    return next(new ApiError(404, "Pan and Aadhar details are required"));
  const user = req?.user;
  if (!user) return next(404, "Cannot find user");
  try {
    const pan = await Document.create({
      docno: panno,
      type: "Pan",
      url: panurl,
      user: user._id,
    });
    if (!pan) return next(new ApiError(500, "Internal Server Error "));
    const aadhar = await Document.create({
      docno: aadharno,
      type: "Aadhar",
      url: aadharurl,
      user: user._id,
    });
    if (!aadhar) return next(new ApiError(500, "Internal Server Error "));
    const detail = {
      address1,
      address2,
      city,
      state,
      zip,
      emp_type,
      income,
      panno: pan._id,
      aadharno: aadhar._id,
      user: user._id,
    };
    await Account.create(detail)
      .then(async (account) => {
        await User.findByIdAndUpdate(user._id, { account: account._id });
        return res.status(200).json(new ApiResponse(200, account));
      })
      .catch((err) => {
        return next(
          new ApiError(500, "Internal Server Error Cannot create account", err)
        );
      });
  } catch (error) {
    return next(new ApiError(500, "Internal Server Error", error));
  }
});

export {
  registerUser,
  verifyUserOtp,
  resendOtp,
  createAccount,
  refreshAcessToken,
  loginUser,
};
