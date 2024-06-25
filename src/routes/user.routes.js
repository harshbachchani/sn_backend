import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createAccount,
  refreshAcessToken,
  registerUser,
  resendOtp,
  verifyUserOtp,
  loginUser,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/verifyotp").post(verifyUserOtp);
router.route("/resendotp").post(resendOtp);
router.route("/login").post(loginUser);
router.route("/account").post(verifyJWT, createAccount);
router.route("/refreshtoken").post(refreshAcessToken);
export default router;
