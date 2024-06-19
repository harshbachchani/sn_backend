import { Router } from "express";
import { registerAdmin, loginAdmin } from "../controllers/admin.controller.js";

const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/").get((req, res) => {
  res.redirect("https://www.google.co.in/");
});

export default router;
