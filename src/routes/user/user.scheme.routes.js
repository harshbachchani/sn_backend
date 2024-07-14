import { Router } from "express";
import { verifyUserJWT } from "../../middlewares/auth.middleware.js";
import {
  createScheme,
  getSchemeDetail,
} from "../../controllers/user/user.scheme.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyUserJWT);
router.route("/").get(getSchemeDetail).post(createScheme);

export default router;
