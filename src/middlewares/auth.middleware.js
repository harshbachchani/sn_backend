import { User } from "../models/user/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new ApiError(401, "Unauthorized request");
    const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedtoken?._id).select(
      "-password -refreshToken"
    );
    // console.log(user);
    if (!user) throw new ApiError(401, "Invalid Access Token");

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

export const verifyAdmin = asyncHandler(async (req, _, next) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Forbidden: Admins only");
  }
  next();
});
