import { prisma } from "../../lib/prisma"

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
    submitRentalRequestInDb
}