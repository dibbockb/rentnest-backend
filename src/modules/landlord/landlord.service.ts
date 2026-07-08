import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { UserRoles } from "../../../generated/prisma/enums";

const deleteListingFromDb = async (id: string, userId: string, userRole: string) => {
    const propertyInDb = await prisma.properties.findUnique({
        where: { id }
    })
    if (!propertyInDb) {
        throw new Error(`No such property found.`)
    }

    const isCreator = propertyInDb.landlord_id === userId
    const isAdmin = userRole === UserRoles.ADMIN
    const hasPermission = isCreator || isAdmin

    if (!hasPermission) {
        throw new Error(`You don't have permission.`)
    }

    const result = await prisma.properties.delete({
        where: { id: propertyInDb.id }
    })
    return result;
}

export const landlordServices = {
    deleteListingFromDb
}