import { Router } from "express";
import { rentalControllers } from "./rental.controller";
import { auth } from "../../middlewares/auth";
import { UserRoles } from "../../../generated/prisma/enums";

const router = Router()

router.get(`/my-requests`,
    auth(UserRoles.ADMIN, UserRoles.TENANT),
    rentalControllers.getMyRequests)

router.get(`/:id`,
    auth(UserRoles.ADMIN, UserRoles.TENANT),
    rentalControllers.getRequestDetails)

router.post(`/:id`,
    auth(UserRoles.TENANT),
    rentalControllers.submitRentalRequest)

export const rentalRouters: Router = router;