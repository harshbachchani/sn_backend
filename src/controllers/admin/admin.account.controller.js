import mongoose from "mongoose";
import { asyncHandler } from "../../utils/asynHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Account } from "../../models/user/account.model.js";
import { User } from "../../models/user/user.model.js";
import { Document } from "../../models/user/document.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const getAllUsers = asyncHandler(async (req, res, next) => {
  try {
    console.log("Hello");
    const users = await User.find().select("_id phoneno fullname").populate({
      path: "account",
      select: "address1 address2",
    });
    return res
      .status(200)
      .json(new ApiResponse(200, users, "User fetched Successfully"));
  } catch (error) {
    return next(new ApiError(400, "Cannot fetch Users", error));
  }
});

const getUserDetail = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ApiError(400, "Invalid User Id"));
  }
  try {
    const result = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
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
    return res
      .status(200)
      .json(new ApiResponse(200, result[0], "User Details get successfully"));
  } catch (error) {
    return next(new ApiError(400, "Cannot get user details", error));
  }
});
export { getAllUsers, getUserDetail };
