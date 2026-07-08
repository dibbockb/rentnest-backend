import { Prisma } from "../../../generated/prisma/browser";
import { UserRoles } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"
import { IModerateUser } from "./admin.interface";

const getAllUsersFromDb = async () => {
    const result = await prisma.user.findMany({
        omit: { password: true }
    })
    return result;
}

const getAllPropertiesFromDb = async () => {
    const result = await prisma.properties.findMany({
        include: {}
    })
    return result;
}

const getAllRentalRequestsFromDb = async () => {
    const result = await prisma.rental_Requests.findMany({
        include:
        {
            property: true,
            tenant: { omit: { password: true } }
        }
    })
    return result;
}

const moderateUserInDb = async (id: string, payload: IModerateUser) => {
    const userInDb = await prisma.user.findUnique({
        where: { id }
    })
    if (!userInDb) {
        throw new Error(`No such user found.`)
    }

    const updatePayload: Prisma.UserUpdateInput = { ...payload }
    if (payload.role) {
        const cleanedRole = payload.role.trim().toUpperCase()
        if (!Object.values(UserRoles).includes(cleanedRole as UserRoles)) {
            throw new Error(`Please enter a valid role: ADMIN, LANDLORD, TENANT`);
        }
        updatePayload.role = cleanedRole as UserRoles
    }

    const result = await prisma.user.update({
        where: { id: userInDb.id },
        data: updatePayload,
        omit: { password: true }
    })

    return result;
}


export const adminServices = {
    getAllUsersFromDb,
    getAllPropertiesFromDb,
    getAllRentalRequestsFromDb,
    moderateUserInDb
}