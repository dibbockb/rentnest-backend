import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRoles } from "../../../generated/prisma/enums";
import { propertiesControllers } from "./properties.controller";

const router = Router()

router.get(`/`, propertiesControllers.getAllListings)
router.get(`/:id`, propertiesControllers.getPropertyDetails)

router.post(`/newlisting`,
    auth(UserRoles.ADMIN, UserRoles.LANDLORD),
    propertiesControllers.createNewListing
)

router.put(`/update/:id`,
    auth(UserRoles.LANDLORD, UserRoles.ADMIN),
    propertiesControllers.updateListing
)


export const propertiesRoutes: Router = router