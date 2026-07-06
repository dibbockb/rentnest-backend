import { Router } from "express";
import { authControllers } from "./auth.controller";

const router = Router()

router.post(`/register`, authControllers.registerUser)


export const authRoutes: Router = router