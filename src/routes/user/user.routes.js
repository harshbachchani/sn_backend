import { Router } from "express";
import {
  refreshAcessToken,
  registerUser,
  resendOtp,
  verifyUserOtp,
  loginUser,
} from "../../controllers/user/user.controller.js";

import userAccountRouter from "./user.account.routes.js";
import userNotificationRouter from "./user.notification.routes.js";
import userSchemeRouter from "./user.scheme.routes.js";

const router = Router();

router.use("/account", userAccountRouter);
router.use("/notification", userNotificationRouter);
router.use("/scheme", userSchemeRouter);
router.route("/register").post(registerUser);
router.route("/verifyotp").post(verifyUserOtp);
router.route("/resendotp").post(resendOtp);
router.route("/login").post(loginUser);

router.route("/refreshtoken").post(refreshAcessToken);
export default router;
