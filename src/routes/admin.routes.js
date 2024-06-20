import { Router } from "express";
import {
  registerAdmin,
  loginAdmin,
  getData,
} from "../controllers/admin.controller.js";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/data").get(verifyJWT, verifyAdmin, getData);

export default router;
