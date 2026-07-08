import { Router } from "express";
import { landlordController } from "./landlord.controller";
import { auth } from "../../middlewares/auth";
import { UserRoles } from "../../../generated/prisma/enums";

const router = Router()

router.delete(`/properties/:id`,
    auth(UserRoles.ADMIN, UserRoles.LANDLORD),
    landlordController.deleteListing)

export const landlordRoutes: Router = router; 