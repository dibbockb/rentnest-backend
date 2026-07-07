import { Router } from "express";
import { authControllers } from "./auth.controller";
import { UserRoles } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";

const router = Router()

router.post(`/register`, authControllers.registerUser)
router.post(`/login`, authControllers.loginUser)
router.post(`/refresh-token`, authControllers.refreshToken)
router.get(`/me`,
    auth(UserRoles.ADMIN, UserRoles.LANDLORD, UserRoles.TENANT),
    authControllers.getCurrentUser
)

export const authRoutes: Router = router