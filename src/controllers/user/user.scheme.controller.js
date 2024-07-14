import { asyncHandler } from "../../utils/asynHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Account } from "../../models/scheme/account.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Nominee } from "../../models/user/nominee.model.js";
import { Scheme } from "../../models/scheme/scheme.model.js";
import { Notification } from "../../models/other/notification.model.js";

const createScheme = asyncHandler(async (req, res, next) => {
  try {
    const user = req.user;
    if (!user.account || !mongoose.Types.ObjectId.isValid(user.account))
      return next(new ApiError(404, "User saving account do not exist"));
    const account = await Account.findOne({ user: user._id });
    if (account.status == "Pending")
      return next(new ApiError(400, "User Saving Account not verified"));

    const {
      amount,
      tenure,
      maturityAmount,
      type,
      fullName,
      phoneNo,
      panNo,
      dob,
      relation,
      totalAmount,
    } = req.body;
    if (
      !(
        amount ||
        tenure ||
        maturityAmount ||
        type ||
        fullName ||
        phoneNo ||
        panNo ||
        relation ||
        dob ||
        totalAmount
      )
    ) {
      return next(new ApiError(400, "All Fields Are Required"));
    }

    let nominee = await Nominee.findOne({ phoneNo: phoneNo });
    if (nominee) {
      if (
        nominee.panNo != panNo ||
        nominee.dob.toISOString().split("T")[0] != dob ||
        nominee.fullName != fullName
      ) {
        return next(
          new ApiError(400, "Nominee Exist but details are not matching")
        );
      }
    } else {
      nominee = await Nominee.create({
        fullName,
        panNo,
        dob,
        phoneNo,
        relation,
      });
    }

    if (!nominee)
      return next(
        new ApiError(500, "Internal Server Error In creating nominee", error)
      );
    const scheme = await Scheme.create({
      payableAmount: amount,
      tenure,
      maturityAmount,
      type,
      remainingAmount: totalAmount, //change according to how much user has to pay
      nomineeId: nominee._id,
      accountId: user.account,
      userId: user._id,
    });

    if (!scheme) return next(new ApiError(500, "Error in creating scheme"));

    const notification = await Notification.create({
      type: "Scheme",
      title: "Scheme Request",
      message: "Scheme request approval from user",
      userId: user._id,
      role: "Admin",
      accountId: user.account,
      schemeId: scheme._id,
    });

    if (!notification)
      return next(new ApiError(500, "Error in creating Notification"));
    return res
      .status(200)
      .json(new ApiResponse(200, scheme, "Scheme request created "));
  } catch (error) {
    return next(new ApiError(500, "Internal Server Error", error));
  }
});

const getSchemeDetail = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId))
      return next(new ApiError(404, "Invalid User Id"));
    const { schemeId } = req.body;
    console.lop;
    if (!mongoose.Types.ObjectId.isValid(schemeId))
      return next(new ApiError(404, "Invalid scheme Id"));

    const scheme = await Scheme.findById(schemeId);
    if (!scheme) return next(new ApiError(404, "Cannot get scheme"));
    return res
      .status(200)
      .json(
        new ApiResponse(200, scheme, "Scheme Details fetched successfully")
      );
  } catch (error) {
    return next(new ApiError(500, "Internal Server Error", error));
  }
});
export { createScheme, getSchemeDetail };
