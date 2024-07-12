import { asyncHandler } from "../../utils/asynHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Account } from "../../models/scheme/account.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { Document } from "../../models/user/document.model.js";
import { User } from "../../models/user/user.model.js";
import { Notification } from "../../models/other/notification.model.js";
const createAccount = asyncHandler(async (req, res, next) => {
  const {
    address1,
    address2,
    city,
    state,
    zip,
    emp_type,
    income,
    panno,
    aadharno,
  } = req.body;
  if (
    !(address1 || address2 || city || state || zip || emp_type || income) ||
    [address1, address2, city, state, zip, emp_type, income].some(
      (field) => field?.trim() === ""
    )
  ) {
    return next(new ApiError(404, "All Fields Are required"));
  }
  if (!(panno || aadharno))
    return next(new ApiError(404, "Pan and Aadhar details are required"));
  const user = req?.user;
  if (!user) return next(404, "Cannot find user");
  if (user.account) {
    return next(new ApiError(404, "User already has an account"));
  }
  const panlocalpath = req.files?.pan?.[0].buffer;
  const aadharlocalpath = req.files?.aadhar?.[0].buffer;
  const photolocalpath = req.files?.photo?.[0].buffer;
  const signaturelocalpath = req.files?.signature?.[0].buffer;
  if (
    !(panlocalpath || aadharlocalpath || photolocalpath || signaturelocalpath)
  ) {
    return next(new ApiError(404, "Cannot get localpath of uploaded files"));
  }
  const pan = await uploadOnCloudinary(panlocalpath);
  if (!pan) {
    return next(
      new ApiError(500, "Server Error cannot upload Pan file on clodinary")
    );
  }
  const aadhar = await uploadOnCloudinary(aadharlocalpath);
  if (!aadhar) {
    return next(
      new ApiError(500, "Server Error cannot upload Aadhar file on clodinary")
    );
  }
  const photo = await uploadOnCloudinary(photolocalpath);
  if (!photo) {
    return next(
      new ApiError(500, "Server Error cannot upload Photo file on clodinary")
    );
  }
  const signature = await uploadOnCloudinary(signaturelocalpath);
  if (!signature) {
    return next(
      new ApiError(500, "Server Error cannot upload Signture file on clodinary")
    );
  }
  try {
    const pandetail = await Document.create({
      docno: panno,
      type: "Pan",
      url: pan.url,
      user: user._id,
    });
    if (!pandetail) return next(new ApiError(500, "Internal Server Error"));
    const aadhardetail = await Document.create({
      docno: aadharno,
      type: "Aadhar",
      url: aadhar.url,
      user: user._id,
    });
    if (!aadhardetail) return next(new ApiError(500, "Internal Server Error "));
    const detail = {
      address1,
      address2,
      city,
      state,
      zip,
      emp_type,
      income,
      panno: pandetail._id,
      aadharno: aadhardetail._id,
      signature: signature.url,
      photo: photo.url,
      user: user._id,
    };
    await Account.create(detail)
      .then(async (account) => {
        await User.findByIdAndUpdate(user._id, { account: account._id });
        const notification = await Notification.create({
          title: "Saving Approval",
          type: "Saving",
          userId: user._id,
          accountId: account._id,
          role: "Admin",
        });
        if (!notification)
          return next(
            new ApiError(500, "Server Error while creating notification")
          );
        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              account,
              "Account creation request has been sent to admin"
            )
          );
      })
      .catch((err) => {
        return next(
          new ApiError(500, "Internal Server Error Cannot create account", err)
        );
      });
  } catch (error) {
    return next(new ApiError(500, "Internal Server Error", error));
  }
});

export { createAccount };
