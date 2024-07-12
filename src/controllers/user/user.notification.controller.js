import { asyncHandler } from "../../utils/asynHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../../models/user/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Notification } from "../../models/other/notification.model.js";

const getUserNotification = asyncHandler(async (req, res, next) => {
  const user = req.user;
  try {
    if (!user) return next(new ApiError(400, "User not found"));
    const notification = await Notification.find({
      userId: user,
      isRead: false,
    });
    return res.status(200).json(new ApiResponse());
  } catch (error) {
    return next(new ApiError(500, "Internal Server Error", error));
  }
});
export { getUserNotification };
