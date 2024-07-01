import { Router } from "express";
import {
  registerAdmin,
  loginAdmin,
  getData,
} from "../controllers/admin/admin.controller.js";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getAllUsers,
  getUserDetail,
} from "../controllers/admin/admin.account.controller.js";

const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/data").get(verifyJWT, verifyAdmin, getData);
router.route("/users").get(getAllUsers);
router.route("/user/:userId").get(getUserDetail);

export default router;
