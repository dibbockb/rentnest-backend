import { UserRoles } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"

const getMyRequestsFromDb = async (userId: string) => {
    const result = await prisma.rental_Requests.findMany({
        where: { requested_by: userId },
        include: { property: true },
    })

    return result;
}

const getRequestDetailsFromDB = async (userId: string, requestId: string, userRole: UserRoles) => {
    const result = await prisma.rental_Requests.findUnique({
        where: { id: requestId, },
        include: {
            property: true,
            tenant: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    })

    if (!result) {
        throw new Error(`Rental request not found.`);
    }
    if (userRole !== UserRoles.ADMIN && result.requested_by !== userId) {
        throw new Error(`You do not have permission to view this request.`);
    }

    return result;
}

const submitRentalRequestInDb = async (propertyId: string, requestedBy: string) => {
    const isPropertyInDb = await prisma.properties.findUniqueOrThrow({
        where: { id: propertyId }
    })

    const result = await prisma.rental_Requests.create({
        data: {
            requested_by: requestedBy,
            property_id: isPropertyInDb.id
        }
    })

    return result;
}

export const rentalServices = {
    submitRentalRequestInDb,
    getMyRequestsFromDb,
    getRequestDetailsFromDB
}