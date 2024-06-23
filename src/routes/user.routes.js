import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  resendOtp,
  verifyOtp,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/verifyotp").post(verifyOtp);
router.route("/resendotp").post(resendOtp);
export default router;
