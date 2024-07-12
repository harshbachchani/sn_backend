import { Router } from "express";

import {
  getUserAccountRequests,
  verifyAccountRequest,
  deleteUserAccount,
  getUserDetail,
} from "../../controllers/admin/admin.account.controller.js";
import {
  verifyAdmin,
  verifyAgentJWT,
} from "../../middlewares/auth.middleware.js";
const router = Router();
router.use(verifyAgentJWT, verifyAdmin);
router
  .route("/requests/:userId")
  .get(getUserDetail)
  .post(verifyAccountRequest)
  .delete(deleteUserAccount);
router.route("/requests").get(getUserAccountRequests);
export default router;
