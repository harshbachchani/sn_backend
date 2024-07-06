import { asyncHandler } from "../../utils/asynHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../../models/user/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Agent } from "../../models/user/agent.model.js";

const generateAccessToken = async (userId) => {
  try {
    const agent = await Agent.findById(userId);
    if (!agent) throw new ApiError("Admin not found", 404);
    const accessToken = await agent.generateAcessToken();
    const refreshToken = await agent.generateRefreshToken();
    return { success: true, data: { accessToken, refreshToken } };
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

const registerAdmin = asyncHandler(async (req, res, next) => {
  const {
    fullName,
    email,
    phoneNo,
    dob,
    address,
    password,
    panNo,
    aadharNo,
    voterId,
  } = req.body;
  if (
    !(
      fullName ||
      email ||
      phoneNo ||
      dob ||
      address ||
      panNo ||
      aadharNo ||
      voterId
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  try {
    const myadmin = await Agent.create({
      fullName: fullName,
      email: email,
      phoneNo: phoneNo,
      address: address,
      password: password,
      dob: dob,
      panNo: panNo,
      aadharNo: aadharNo,
      voterId: voterId,
      role: "Admin",
      verified: true,
    });
    const createdadmin = await Agent.findById(myadmin._id).select(
      "-password -role -verified -refreshToken"
    );
    if (!createdadmin) {
      return next(
        new ApiError(500, "Something went wrong while registering admin")
      );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, createdadmin, "Admin Created Successfully"));
  } catch (error) {
    return next(new ApiError(400, "Error while registering admin", error));
  }
});

const loginAdmin = asyncHandler(async (req, res, next) => {
  const { userId, password } = req.body;
  if (!(password || userId)) {
    return next(new ApiError(400, "All field are required"));
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ApiError(400, "Invalid User Id"));
  }
  try {
    const myadmin = await Agent.findById(userId);
    if (!(myadmin || myadmin.role != "Admin")) {
      return next(new ApiError(404, "Admin do not exist"));
    }
    const ispasswordmatch = await myadmin.isPassWordCorrect(password);
    if (!ispasswordmatch) return next(400, "Invalid Credentials");
    const result = await generateAccessToken(myadmin._id);
    if (!result.success) {
      return next(
        new ApiError(
          500,
          "Cannot generate access and refresh token ",
          result.error
        )
      );
    } else {
      const refreshToken = result.data.refreshToken;
      const accessToken = result.data.accessToken;
      const loggedInAdmin = await Agent.findByIdAndUpdate(
        myadmin._id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      ).select("-password -role ");
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            admin: loggedInAdmin,
            accessToken,
          },
          "Admin logged In Successfully"
        )
      );
    }
  } catch (error) {
    return next(new ApiError(500, "Internal Server Error", error));
  }
});

const getData = asyncHandler(async (req, res) => {
  if (!req.agent) throw new ApiError(403, "Admin not found");

  return res
    .status(200)
    .json(new ApiResponse(200, req.agent, "Admin data fetched Successfully"));
});
export { registerAdmin, loginAdmin, getData };
