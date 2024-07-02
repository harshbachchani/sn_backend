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
      error: {
        msg: "Something Went Wrong while generating access token",
        error: err,
      },
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

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, "email is required");
  }
  const myadmin = await User.findOne({
    $or: [{ email }],
  });
  if (!(myadmin || myadmin.role !== "Admin")) {
    throw new ApiError(404, "Admin does not exist");
  }
  const ispasswordmatch = await myadmin.isPassWordCorrect(password);
  if (!ispasswordmatch) throw new ApiError(403, "Invalid Admin Credentials");
  const { accesstoken } = await generateAccessToken(myadmin._id);
  const loggedInAdmin = await User.findById(myadmin._id).select("-password");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        admin: loggedInAdmin,
        accesstoken,
      },
      "Admin logged In Successfully"
    )
  );
});

const getData = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(403, "Admin not found");
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Admin data fetched Successfully"));
});
export { registerAdmin, loginAdmin, getData };
