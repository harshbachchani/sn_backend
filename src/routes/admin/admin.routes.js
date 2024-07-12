import { Router } from "express";
import {
  registerAdmin,
  loginAdmin,
  refreshAccessToken,
} from "../../controllers/admin/admin.controller.js";
import adminSchemeRouter from "./admin.scheme.routes.js";
import adminNotificationRouter from "./admin.notification.routes.js";
import adminAccountRouter from "./admin.account.routes.js";

const router = Router();

router.use("/scheme", adminSchemeRouter);
router.use("/notification", adminNotificationRouter);
router.use("/account", adminAccountRouter);

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/refreshtoken").post(refreshAccessToken);

export default router;
