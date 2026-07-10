import { Router } from "express";
import { paymentControllers } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { UserRoles } from "../../../generated/prisma/enums";

const router = Router();

router.post(`/create/:rentalRequestId`,
    auth(UserRoles.TENANT),
    paymentControllers.createCheckoutSession)

router.post(`/webhook`, paymentControllers.handleWebhook)

router.get(`/`,
    auth(UserRoles.TENANT, UserRoles.ADMIN),
    paymentControllers.getMyPaymentHistory)

router.get(`/:id`,
    auth(UserRoles.TENANT, UserRoles.ADMIN),
    paymentControllers.getPaymentDetails)

export const paymentRoutes: Router = router