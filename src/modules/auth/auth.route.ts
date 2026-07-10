import { Router } from "express";
import { authControllers } from "./auth.controller";
import { UserRoles } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { loginSchema, registerSchema } from "./auth.validation";

const router = Router()

router.post(`/register`,
    validateRequest(registerSchema),
    authControllers.registerUser)

router.post(`/login`,
    validateRequest(loginSchema),
    authControllers.loginUser)

router.post(`/refresh-token`, authControllers.refreshToken)

router.get(`/me`,
    auth(UserRoles.ADMIN, UserRoles.LANDLORD, UserRoles.TENANT),
    authControllers.getCurrentUser
)

export const authRoutes: Router = router