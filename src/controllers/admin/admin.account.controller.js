import mongoose from "mongoose";
import { asyncHandler } from "../../utils/asynHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Account } from "../../models/scheme/account.model.js";
import { User } from "../../models/user/user.model.js";
import { Document } from "../../models/user/document.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { deletefromCloudinary } from "../../utils/cloudinary.js";
import { Notification } from "../../models/other/notification.model.js";

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

const getUserAccountRequests = asyncHandler(async (req, res, next) => {
  try {
    const { status } = req.query;
    if (!status)
      return next(new ApiError(400, "Status of account is required"));
    const users = await User.aggregate([
      {
        $lookup: {
          from: "accounts",
          localField: "account",
          foreignField: "_id",
          as: "accountInfo",
        },
      },
      {
        $unwind: "$accountInfo",
      },
      {
        $match: { "accountInfo.status": status },
      },
      {
        $project: {
          _id: 1,
          phoneno: 1,
          email: 1,
          dob: 1,
          fullname: 1,
          "accountInfo.photo": 1,
          "accountInfo.address1": 1,
          "accountInfo.address2": 1,
          "accountInfo.city": 1,
        },
      },
    ]);
    return res
      .status(200)
      .json(new ApiResponse(200, users, "User fetched Successfully"));
  } catch (error) {
    return next(new ApiError(400, "Cannot get requests", error));
  }
});

const verifyAccountRequest = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ApiError(400, "Not a valid user id"));
  }
  try {
    const account = await Account.findOne({
      user: userId,
    });
    if (!account) return next(new ApiError(400, "User don't have any account"));
    if (account.status === "Verified")
      return next(new ApiError(400, "Account already Verified"));
    await Account.findByIdAndUpdate(
      account._id,
      {
        status: "Verified",
      },
      { new: true }
    )
      .then(async (data) => {
        const deletednotification = await Notification.deleteMany({
          userId,
          role: "Admin",
          type: "Saving",
        });
        const notification = await Notification.create({
          role: "User",
          title: "Saving Approval",
          type: "Saving",
          message: "Saving Account approval request",
          userId: userId,
          accountId: account._id,
        });
        if (!notification)
          return next(new ApiError(504, "Error in creating notification"));
        return res
          .status(200)
          .json(
            new ApiResponse(200, data, "Account has been verified successfully")
          );
      })
      .catch((e) => {
        console.log(e);
        return next(new ApiError(500, "Error while verifying account", e));
      });
  } catch (error) {
    return next(new ApiError(500, "Internal Server error", error));
  }
});
const deleteUserAccount = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ApiError(400, "Not a valid user id"));
  }
  try {
    const account = await Account.findOne({ user: userId });
    if (account.status == "Verified")
      return next(new ApiError(404, "User is verified cannot delete"));
    await Account.findByIdAndDelete(account._id);
    if (!account) return next(new ApiError(400, "Account not exists"));
    const signatureUrl = account.signature;
    const photourl = account.photo;
    const aadhar = await Document.findByIdAndDelete(account.aadharno);
    const pan = await Document.findByIdAndDelete(account.panno);
    await Document.findByIdAndDelete(account.aadhar);
    const aadharurl = aadhar.url;
    const panurl = pan.url;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $unset: { account: "" },
      },
      { new: true }
    );

    const resultphoto = await deletefromCloudinary([photourl]);
    const resultaadhar = await deletefromCloudinary([aadharurl]);
    const resultpan = await deletefromCloudinary([panurl]);
    const resultsignature = await deletefromCloudinary([signatureUrl]);
    if (!(resultaadhar || resultphoto || resultpan || resultsignature))
      console.log("error in deleting from clodinary");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          account,
          "User Saving Account removed successfully"
        )
      );
  } catch (error) {
    return next(new ApiError(500, "Internal Server error", error));
  }
});
export {
  getUserDetail,
  verifyAccountRequest,
  getUserAccountRequests,
  deleteUserAccount,
};
