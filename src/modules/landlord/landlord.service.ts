import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { RentalRequestStatus, UserRoles } from "../../../generated/prisma/enums";
import { appError } from "../../utils/appError";

const getAllPropertiesFromDb = async (userId: string) => {
    const result = await prisma.properties.findMany({
        where: { landlord_id: userId }
    })
    return result;
}

const getAllRequestsFromDb = async (userId: string) => {
    const result = await prisma.rental_Requests.findMany({
        where: {
            property: {
                landlord_id: userId
            }
        },
        include: {
            property: true,
            tenant: { omit: { password: true } },
        },
        orderBy: {
            created_at: "desc"
        }
    })

    return result;
}

const manageRequestInDb = async (requestId: string, userId: string, statusAction: RentalRequestStatus) => {
    const rentalRequest = await prisma.rental_Requests.findUnique({
        where: { id: requestId },
        include: { property: true }
    })

    if (!rentalRequest) {
        throw appError(`Rental request not found.`, 404)
    }

    if (rentalRequest.property.landlord_id !== userId) {
        throw appError(`Unauthorized.`, 403)
    }

    const result = await prisma.rental_Requests.update({
        where: { id: rentalRequest.id },
        data: { status: statusAction }
    })
    return result;
}

const deleteListingFromDb = async (id: string, userId: string, userRole: string) => {
    const propertyInDb = await prisma.properties.findUnique({
        where: { id }
    })
    if (!propertyInDb) {
        throw appError(`No such property found.`, 404)
    }

    const isCreator = propertyInDb.landlord_id === userId
    const isAdmin = userRole === UserRoles.ADMIN
    const hasPermission = isCreator || isAdmin

    if (!hasPermission) {
        throw appError(`You don't have permission.`, 403)
    }

    const result = await prisma.properties.delete({
        where: { id: propertyInDb.id }
    })
    return result;
}

export const landlordServices = {
    getAllPropertiesFromDb,
    getAllRequestsFromDb,
    deleteListingFromDb,
    manageRequestInDb
}