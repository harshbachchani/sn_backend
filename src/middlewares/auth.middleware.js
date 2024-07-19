import { User } from "../models/user/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Agent } from "../models/user/agent.model.js";
import { asyncHandler } from "../utils/asynHandler.js";
import jwt from "jsonwebtoken";

const verifyUserJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return next(new ApiError(401, "Unauthorized request"));
    const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedtoken?._id).select("-refreshToken");
    if (!user) return next(new ApiError(401, "Invalid Access Token"));
    if (!user.verified) return next(new ApiError(400, "User is not verified"));
    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, error?.message || "Invalid Access Token"));
  }
});
const verifyAgentJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return next(new ApiError(401, "Unauthorized request"));
    const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const agent = await Agent.findById(decodedtoken?._id).select(
      "-verified -refreshToken -password"
    );

    if (!agent) return next(new ApiError(401, "Invalid Access Token"));

    req.agent = agent;
    next();
  } catch (error) {
    return next(new ApiError(401, error?.message || "Invalid Access Token"));
  }
});

const verifyAdmin = asyncHandler(async (req, _, next) => {
  if (req.agent.role !== "Admin") {
    return next(new ApiError(403, "Forbidden: Admins only"));
  }
  next();
});

export { verifyAdmin, verifyUserJWT, verifyAgentJWT };
