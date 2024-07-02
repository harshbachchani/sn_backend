import { Router } from "express";
import {
  registerAdmin,
  loginAdmin,
  getData,
} from "../controllers/admin/admin.controller.js";
import {
  getAllUsers,
  getUserDetail,
} from "../controllers/admin/admin.account.controller.js";
import { verifyAdmin, verifyAgentJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/data").get(verifyAgentJWT, verifyAdmin, getData);
router.route("/users").get(verifyAgentJWT, verifyAdmin, getAllUsers);
router.route("/user/:userId").get(verifyAgentJWT, verifyAdmin, getUserDetail);

export default router;
