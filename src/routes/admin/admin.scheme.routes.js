import { Router } from "express";
import {
  verifyAdmin,
  verifyAgentJWT,
} from "../../middlewares/auth.middleware.js";
import {
  getAllSchemeRequests,
  getUserSchemeDetail,
} from "../../controllers/admin/admin.scheme.controller.js";

const router = Router();
router.use(verifyAgentJWT, verifyAdmin);
router.route("/requests/:schemeId").get(getUserSchemeDetail);
router.route("/requests").get(getAllSchemeRequests);
export default router;
