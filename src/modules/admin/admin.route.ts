import { Router } from "express";
import { adminControllers } from "./admin.controller";
import { auth } from "../../middlewares/auth";
import { UserRoles } from "../../../generated/prisma/enums";
import { moderateUserSchema } from "./admin.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router()

router.get(`/users`,
    auth(UserRoles.ADMIN),
    adminControllers.getAllUsers)

router.get(`/properties`,
    auth(UserRoles.ADMIN),
    adminControllers.getAllProperties)

router.get(`/rentals`,
    auth(UserRoles.ADMIN),
    adminControllers.getAllRentalRequests)

router.patch(`/users/:id`,
    validateRequest(moderateUserSchema),
    auth(UserRoles.ADMIN),
    adminControllers.moderateUser)

export const adminRoutes: Router = router;