import { asyncHandler } from "../../utils/asynHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Account } from "../../models/scheme/account.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Notification } from "../../models/other/notification.model.js";
import { Loan } from "../../models/loans/loan.model.js";
import { AllLoans } from "../../models/loans/allLoan.model.js";
import { Guarantor } from "../../models/user/gurantor.model.js";
import { PropertyLoan } from "../../models/loans/property_loan.model.js";

// yahe pe allLoans model se sare loans la raha hai and give only property loans
const getAllLoans = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId))
      return next(new ApiError(404, "Invalid User Id"));
    const loans = await AllLoans.find();
    // send only loans with type property
    if (!loans) return next(new ApiError(404, "Cannot get loans"));
    return res
      .status(200)
      .json(new ApiResponse(200, loans, "All Loans fetched successfully"));
  } catch (error) {
    return next(new ApiError(500, "Internal Server Error", error));
  }
});

// single loan details are going to show here
const getLoanDetail = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId))
      return next(new ApiError(404, "Invalid User Id"));
    const { loanId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(loanId))
      return next(new ApiError(404, "Invalid loan Id"));

    const loan = await AllLoans.findById(loanId);
    if (!loan) return next(new ApiError(404, "Cannot get loan"));
    return res
      .status(200)
      .json(new ApiResponse(200, loan, "Loan Details fetched successfully"));
  } catch (error) {
    return next(new ApiError(500, "Internal Server Error", error));
  }
});

// yaha pe user details fetch hogi, phir account details, check if guarantor is availble if not then create one 
// problem with ref as have to fetch account and gurantor
// then we fill the loan details 
// create a new property loan in propertyloan model with userdetails,account details,gurantor , specific loan detail,
//  and also create the ref to loan id and status which i had to update laterwards
// now admin gets to access the loan requests from propertyloan model.
//  all types of loan models are discriminators of loan model and loan model refers to allloans model.
const createPropertyLoan = asyncHandler(async (req, res, next) => {
  try {
    const user = req.user;
    if (!user.account || !mongoose.Types.ObjectId.isValid(user.account))
      return next(new ApiError(404, "User saving account do not exist"));

    const { loanId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(loanId))
      return next(new ApiError(404, "Invalid loan Id"));
    const loan = await Loan.findById(loanId);

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
        amount &&
        tenure &&
        maturityAmount &&
        type &&
        fullName &&
        phoneNo &&
        panNo &&
        relation &&
        dob &&
        totalAmount
      )
    ) {
      return next(new ApiError(400, "All Fields Are Required"));
    }

    // find gurantor and create it.
    let guarantor = await Guarantor.findOne({ phoneNo: phoneNo });
    if (guarantor) {
      if (
        guarantor.panNo != panNo ||
        guarantor.dob.toISOString().split("T")[0] != dob ||
        guarantor.fullName != fullName
      ) {
        return next(
          new ApiError(400, "Guarantor Exist but details are not matching")
        );
      }
    } else {
      guarantor = await Guarantor.create({
        fullName,
        panNo,
        dob,
        phoneNo,
        relation,
      });
    }

    if (!guarantor)
      return next(
        new ApiError(500, "Internal Server Error In creating nominee", error)
      );

    // now take property type address value from user
    const newLoan = await PropertyLoan.create({
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
      .json(new ApiResponse(200, newLoan, "Loan request created "));
  } catch (error) {
    return next(new ApiError(500, "Internal Server Error", error));
  }
});

export { createPropertyLoan, getLoanDetail, getAllLoans };
