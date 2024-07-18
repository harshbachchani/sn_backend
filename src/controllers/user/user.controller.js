import { asyncHandler } from "../../utils/asynHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../../models/user/user.model.js";
import { sendOtp, verifyOtp } from "../../utils/twilio.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
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
    !(fullname && email && phoneno && dob)
  ) {
    return next(new ApiError(400, "Please fill all the required fields"));
  }

  const xuser = await User.findOne({
    $or: [{ phoneno: phoneno }, { email: email }],
  });
  if (xuser) {
    return next(
      new ApiError(400, "User already exists with same email or phoneno exists")
    );
  }

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
});

const verifyUserOtp = asyncHandler(async (req, res, next) => {
  const { userId, otp } = req.body;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ApiError(400, "Invalid user Id "));
  }
  if (!(otp && userId)) {
    return next(new ApiError(400, "OTP and userId are required"));
  }
  try {
    const user = await User.findById(userId).select("-refreshtoken -verified");

    if (!user) {
      return next(new ApiError(400, "User not found"));
    }
    const result = await verifyOtp(user.phoneno, otp);
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
      const userDetail = await User.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(user._id),
          },
        },
        {
          $lookup: {
            from: "accounts",
            localField: "account",
            foreignField: "_id",
            as: "account",
            pipeline: [
              {
                $lookup: {
                  from: "documents",
                  localField: "panno",
                  foreignField: "_id",
                  as: "pandetail",
                },
              },
              {
                $lookup: {
                  from: "documents",
                  localField: "aadharno",
                  foreignField: "_id",
                  as: "aadhardetail",
                },
              },
              {
                $addFields: {
                  pandetail: { $arrayElemAt: ["$pandetail", 0] },
                  aadhardetail: { $arrayElemAt: ["$aadhardetail", 0] },
                },
              },
              {
                $project: {
                  _id: 1, //treated as account no
                  address1: 1,
                  address2: 1,
                  city: 1,
                  state: 1,
                  zip: 1,
                  emp_type: 1,
                  income: 1,
                  signature: 1,
                  photo: 1,
                  "pandetail.docno": 1,
                  "pandetail.url": 1,
                  "pandetail.type": 1,
                  "aadhardetail.docno": 1,
                  "aadhardetail.url": 1,
                  "aadhardetail.type": 1,
                },
              },
            ],
          },
        },
        {
          $unwind: "$account",
        },
        {
          $project: {
            _id: 1,
            phoneno: 1,
            dob: 1,
            email: 1,
            fullname: 1,
            account: 1,
          },
        },
      ]);
      if (!userDetail)
        return next(new ApiError(404, "Cannot get details of user"));
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { user: userDetail[0], accesstoken, refreshtoken },
            "User Verified Successfully"
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
  try {
    const { userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(new ApiError(400, "Invalid User Id"));
    }
    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError(400, "User not found"));
    }
    const result = await sendOtp(user.phoneno);
    if (result.success) {
      return res
        .status(200)
        .json(
          new ApiResponse(200, { userId: user._id }, "OTP Resent successfully")
        );
    } else {
      return next(
        new ApiError(
          500,
          "Internal Server Error Failed to send OTP",
          result.error
        )
      );
    }
  } catch (error) {
    return next(new ApiError(400, "Something Went Wrong", error));
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

export { registerUser, verifyUserOtp, resendOtp, refreshAcessToken, loginUser };
