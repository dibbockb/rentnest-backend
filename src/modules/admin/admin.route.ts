import { Router } from "express";
import { adminControllers } from "./admin.controller";
import { auth } from "../../middlewares/auth";
import { UserRoles } from "../../../generated/prisma/enums";

const router = Router()

router.get(`/users`,
    auth(UserRoles.ADMIN),
    adminControllers.getAllUsers)

router.get(`/properties`,
    auth(UserRoles.ADMIN),
    adminControllers.getAllProperties)



export const adminRoutes: Router = router;