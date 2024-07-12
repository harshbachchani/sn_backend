import { asyncHandler } from "../../utils/asynHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Notification } from "../../models/other/notification.model.js";

const getAllNotifications = asyncHandler(async (req, res, next) => {
  try {
    const admin = req.agent;
    if (!admin) return next(new ApiError(400, "Admin not found"));

    const notifications = await Notification.find({
      isRead: false,
      role: "Admin",
    })
      .populate({
        path: "userId",
        select: "fullname phoneno",
      })
      .populate({
        path: "schemeId",
        select: "type",
      })
      .populate({
        path: "accountId",
        select: "address1 address2 city state ",
      });
    if (!notifications)
      return next(new ApiError(404, "Cannot get Notifications"));
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          notifications,
          "Notifications fetched successfully"
        )
      );
  } catch (error) {
    return next(new ApiError(500, "Internal Server Error", error));
  }
});

export { getAllNotifications };
