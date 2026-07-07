import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRoles } from "../../../generated/prisma/enums";
import { propertiesControllers } from "./properties.controller";

const router = Router()

router.post(`/newlisting`,
    auth(UserRoles.ADMIN, UserRoles.LANDLORD),
    propertiesControllers.createNewListing
)

export const propertiesRoutes: Router = router