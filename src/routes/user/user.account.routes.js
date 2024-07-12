import { Router } from "express";
import { verifyUserJWT } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { createAccount } from "../../controllers/user/user.account.controller.js";
const router = Router();

router.use(verifyUserJWT);
router.route("/").post(
  upload.fields([
    { name: "pan", maxCount: 1 },
    { name: "aadhar", maxCount: 1 },
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  createAccount
);

export default router;
