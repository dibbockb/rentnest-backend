import { Router } from "express";
import { authControllers } from "./auth.controller";

const router = Router()

router.post(`/register`, authControllers.registerUser)
router.post(`/login`, authControllers.loginUser)
router.post(`/refresh-token`, authControllers.refreshToken)

export const authRoutes: Router = router