import { Router } from "express";
import {
  verifyAdmin,
  verifyAgentJWT,
} from "../../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyAgentJWT, verifyAdmin);
router.route("/").get((req, res) => {
  return res.send("Hello there ");
});
export default router;
