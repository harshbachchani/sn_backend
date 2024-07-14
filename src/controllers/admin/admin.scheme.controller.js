import { asyncHandler } from "../../utils/asynHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Scheme } from "../../models/scheme/scheme.model.js";
import { Notification } from "../../models/other/notification.model.js";

const getAllSchemeRequests = asyncHandler(async (req, res, next) => {
  try {
    const type = req.query.type;
    const matchStage = {
      status: "Pending",
      "accountDetails.status": "Verified",
    };

    // Add type to match stage only if it is provided
    if (type) {
      matchStage.type = type;
    }
    const requests = await Scheme.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "accounts",
          localField: "accountId",
          foreignField: "_id",
          as: "accountDetails",
        },
      },
      {
        $unwind: "$accountDetails",
      },

      {
        $unwind: "$userDetails",
      },

      {
        $match: matchStage,
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          "userDetails.fullname": 1,
          "userDetails.email": 1,
          "userDetails.phoneno": 1,
          "accountDetails.address1": 1,
          "accountDetails.address2": 1,
          "accountDetails.city": 1,
          "accountDetails.state": 1,
          "accountDetails.state": 1,
          payableAmount: 1,
          tenure: 1,
          type: 1,
        },
      },
    ]);
    if (!requests) return next(new ApiError(404, "Cannot get requests"));
    return res
      .status(200)
      .json(
        new ApiResponse(200, requests, "Scheme requests fetched successfully")
      );
  } catch (err) {
    return next(new ApiError(500, "Internal Server Error", err));
  }
});

const getUserSchemeDetail = asyncHandler(async (req, res, next) => {
  try {
    const { schemeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(schemeId))
      return next(new ApiError(400, "Invalid Scheme Id"));
    const result = await Scheme.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(schemeId),
        },
      },
      {
        $lookup: {
          from: "nominees",
          localField: "nomineeId",
          foreignField: "_id",
          as: "nomineeDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "accounts",
          localField: "accountId",
          foreignField: "_id",
          as: "accountDetails",
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
        $unwind: "$accountDetails",
      },
      {
        $unwind: "$nomineeDetails",
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 1,
          payableAmount: 1,
          tenure: 1,
          maturityAmount: 1,
          type: 1,
          totalAmount: 1,
          "userDetails.fullname": 1,
          "userDetails.email": 1,
          "userDetails.phoneno": 1,
          "userDetails.dob": 1,
          "nomineeDetails.fullName": 1,
          "nomineeDetails.panNo": 1,
          "nomineeDetails.relation": 1,
          "nomineeDetails.dob": 1,
          "nomineeDetails.phoneno": 1,
          accountDetails: 1,
        },
      },
    ]);
    if (!result) return next(new ApiError(500, "Error in showing result "));
    return res
      .status(200)
      .json(
        new ApiResponse(200, result, "Scheme Details fetched successfully")
      );
  } catch (error) {
    return next(new ApiError(500, "Internal Server Error", error));
  }
});

const verifySchemeRequest = asyncHandler(async (req, res, next) => {});
export { getAllSchemeRequests, getUserSchemeDetail, verifySchemeRequest };
