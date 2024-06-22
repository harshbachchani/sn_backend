import { asyncHandler } from "../utils/asynHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError("User not found", 404);
    const accesstoken = await user.generateAcessToken();
    console.log(accesstoken);
    return { accesstoken };
  } catch (err) {
    console.log(`The error is ${err}`);
    throw new ApiError(
      500,
      "Something Went Wrong while generating access token"
    );
  }
};

const registerAdmin = asyncHandler(async (req, res) => {
  const { fullname, email, phoneno, address, password } = req.body;
  if (
    [fullname, email, phoneno, address, password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({ $or: [{ email }] });
  if (existedUser) {
    throw new ApiError(409, "Admin with this email already exist");
  }
  const myadmin = await User.create({
    fullname: fullname,
    email: email,
    phoneno: phoneno,
    address: address,
    password: password,
  });
  const createdadmin = await User.findById(myadmin._id).select("-password ");
  if (!createdadmin) {
    throw new ApiError(
      500,
      "Something Went Wrong while registering the admin!!"
    );
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdadmin, "Admin Created Successfully"));
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
