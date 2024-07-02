import { Router } from "express";
import { verifyUserJWT } from "../middlewares/auth.middleware.js";
import {
  createAccount,
  refreshAcessToken,
  registerUser,
  resendOtp,
  verifyUserOtp,
  loginUser,
  testingupload,
} from "../controllers/user/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/verifyotp").post(verifyUserOtp);
router.route("/resendotp").post(resendOtp);
router.route("/login").post(loginUser);
router.route("/account").post(
  verifyUserJWT,
  upload.fields([
    { name: "pan", maxCount: 1 },
    { name: "aadhar", maxCount: 1 },
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  createAccount
);
router.route("/refreshtoken").post(refreshAcessToken);
router.route("/testing").post(upload.single("image"), testingupload);
export default router;
