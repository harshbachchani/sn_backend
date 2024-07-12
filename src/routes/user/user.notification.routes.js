import { Router } from "express";
import { verifyUserJWT } from "../../middlewares/auth.middleware.js";
import { getUserNotification } from "../../controllers/user/user.notification.controller.js";
const router = Router();

router.use(verifyUserJWT);
router.route("/").get(getUserNotification);

export default router;
