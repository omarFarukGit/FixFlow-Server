import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ServiceRequestController } from "./service-request.controller";
import { ServiceRequestValidationSchema } from "./service-request.validation";

const router = Router();

router.post(
  "/",
  auth(Role.CUSTOMER),
  validateRequest(
    ServiceRequestValidationSchema.CreateServiceRequestValidationSchema,
  ),
  ServiceRequestController.createServiceRequest,
);
router.get(
  "/",
  auth(Role.CUSTOMER),
  ServiceRequestController.getMyServiceRequests,
);

router.get(
  "/:id",
  auth(Role.CUSTOMER),
  ServiceRequestController.getMyServiceRequestById,
);

router.patch(
  "/:id",
  auth(Role.CUSTOMER),
  validateRequest(
    ServiceRequestValidationSchema.UpdateServiceRequestValidationSchema,
  ),
  ServiceRequestController.updateMyServiceRequest,
);
router.patch(
  "/:id/cancel",
  auth(Role.CUSTOMER),
  ServiceRequestController.cancelMyServiceRequest,
);
export const ServiceRequestRoutes = router;
