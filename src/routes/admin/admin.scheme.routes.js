import { Router } from "express";
import {
  verifyAdmin,
  verifyAgentJWT,
} from "../../middlewares/auth.middleware.js";
import {
  deleteSchemeRequest,
  getAllSchemeRequests,
  getUserSchemeDetail,
  verifySchemeRequest,
} from "../../controllers/admin/admin.scheme.controller.js";

const router = Router();
router.use(verifyAgentJWT, verifyAdmin);
router
  .route("/requests/:schemeId")
  .get(getUserSchemeDetail)
  .delete(deleteSchemeRequest)
  .post(verifySchemeRequest);
router.route("/requests").get(getAllSchemeRequests);
export default router;
