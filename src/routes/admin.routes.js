import { Router } from "express";
import {
  registerAdmin,
  loginAdmin,
  getData,
} from "../controllers/admin/admin.controller.js";
import {
  getUserAccountRequests,
  verifyAccountRequest,
  deleteUserAccount,
  getUserDetail,
} from "../controllers/admin/admin.account.controller.js";
import { verifyAdmin, verifyAgentJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/data").get(verifyAgentJWT, verifyAdmin, getData);
router
  .route("/user/account/requests/:userId")
  .get(verifyAgentJWT, verifyAdmin, getUserDetail)
  .post(verifyAgentJWT, verifyAdmin, verifyAccountRequest)
  .delete(verifyAgentJWT, verifyAdmin, deleteUserAccount);
router
  .route("/user/account/requests")
  .get(verifyAgentJWT, verifyAdmin, getUserAccountRequests);
export default router;
