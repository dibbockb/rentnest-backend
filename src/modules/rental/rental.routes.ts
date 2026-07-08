import { Router } from "express";
import { rentalControllers } from "./rental.controller";
import { auth } from "../../middlewares/auth";
import { UserRoles } from "../../../generated/prisma/enums";

const router = Router()

router.post(`/:id`,
    auth(UserRoles.TENANT),
    rentalControllers.submitRentalRequest)

export const rentalRouters: Router = router;