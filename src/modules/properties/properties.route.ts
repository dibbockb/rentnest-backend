import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRoles } from "../../../generated/prisma/enums";
import { propertiesControllers } from "./properties.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createPropertySchema, updatePropertySchema } from "./properties.validation";

const router = Router()

router.get(`/`, propertiesControllers.getAllListings)
router.get(`/categories`, propertiesControllers.getAllCategories)
router.get(`/:id`, propertiesControllers.getPropertyDetails)

router.post(`/newlisting`,
    validateRequest(createPropertySchema),
    auth(UserRoles.ADMIN, UserRoles.LANDLORD),
    propertiesControllers.createNewListing
)

router.put(`/update/:id`,
    validateRequest(updatePropertySchema),
    auth(UserRoles.LANDLORD, UserRoles.ADMIN),
    propertiesControllers.updateListing
)

export const propertiesRoutes: Router = router