import { Router } from "express";
import { landlordControllers } from "./landlord.controller";
import { auth } from "../../middlewares/auth";
import { UserRoles } from "../../../generated/prisma/enums";

const router = Router()

router.get(`/properties`,
    auth(UserRoles.LANDLORD),
    landlordControllers.getAllProperties

)

router.get(`/requests`,
    auth(UserRoles.LANDLORD),
    landlordControllers.getAllRequests

)

router.patch(`/properties/:requestId`,
    auth(UserRoles.LANDLORD),
    landlordControllers.manageRequest
)

router.delete(`/properties/:id`,
    auth(UserRoles.ADMIN, UserRoles.LANDLORD),
    landlordControllers.deleteListing)

export const landlordRoutes: Router = router;