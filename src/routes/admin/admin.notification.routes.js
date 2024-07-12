import { Router } from "express";
import {
  verifyAdmin,
  verifyAgentJWT,
} from "../../middlewares/auth.middleware.js";
import { getAllNotifications } from "../../controllers/admin/admin.notification.controller.js";

const router = Router();
router.use(verifyAgentJWT, verifyAdmin);
router.route("/").get(getAllNotifications);
export default router;
