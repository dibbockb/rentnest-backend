import { Router } from "express";
import { paymentControllers } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { UserRoles } from "../../../generated/prisma/enums";

const router = Router();

router.post(`/create/:rentalRequestId`,
    auth(UserRoles.TENANT),
    paymentControllers.createCheckoutSession)

export const paymentRoutes: Router = router