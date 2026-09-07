import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AuditLogController } from "./audit-log.controller";
import { GetAuditLogsValidationSchema } from "./audit-log.validation";

const router = Router();

router.get(
  "/",
  auth("ADMIN"),
  validateRequest(GetAuditLogsValidationSchema),
  AuditLogController.getAuditLogs,
);

export const AuditLogRoutes = router;
