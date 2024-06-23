import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createAccount,
  registerUser,
  resendOtp,
  verifyUserOtp,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/verifyotp").post(verifyUserOtp);
router.route("/resendotp").post(resendOtp);
router.route("/account").post(verifyJWT, createAccount);
export default router;
