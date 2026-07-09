import { RentalRequestStatus, UserRoles } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"
import { IReview } from "./rental.interface";

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

const submitReviewInDb = async (payload: IReview, propertyId: string, userId: string) => {
    const propertyInDb = await prisma.properties.findUnique({
        where: { id: propertyId },
    })
    if (!propertyInDb) {
        throw new Error(`No such property found.`)
    }

    const isValidTenant = await prisma.rental_Requests.findFirst({
        where: {
            property_id: propertyId,
            requested_by: userId,
            status: RentalRequestStatus.COMPLETED
        }
    })
    if (!isValidTenant) {
        throw new Error(`Access denied.`)
    }

    const existingReview = await prisma.reviews.findFirst({
        where: {
            property_id: propertyId,
            tenant_id: userId
        }
    });
    if (existingReview) {
        throw new Error('You have already submitted a review for this property.');
    }

    const result = await prisma.reviews.create({
        data: {
            rating: payload.stars,
            content: payload.content,
            property_id: propertyId,
            tenant_id: userId
        }
    });
    return result;
}

export const rentalServices = {
    submitRentalRequestInDb,
    getMyRequestsFromDb,
    getRequestDetailsFromDB,
    submitReviewInDb
}