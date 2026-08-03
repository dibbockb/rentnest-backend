import { Prisma } from "../../../generated/prisma/browser";
import { UserRoles } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"
import { appError } from "../../utils/appError";
import { IModerateUser } from "./admin.interface";

const getAllUsersFromDb = async (page: number, limit: number) => {
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            skip,
            take: limit,
            orderBy: { created_at: "desc" },
        }),
        prisma.user.count(),
    ])

    return {
        users,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    }
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
        throw appError(`No such user found.`, 404)
    }

    const updatePayload: Prisma.UserUpdateInput = { ...payload }

    const result = await prisma.user.update({
        where: { id: userInDb.id },
        data: updatePayload,
        omit: { password: true }
    })

    return result;
}

const deletePropertyInDb = async (id: string) => {
    const propertyInDb = await prisma.properties.findUnique({
        where: { id }
    })
    if (!propertyInDb) {
        throw appError(`No property found.`, 404)
    }

    const result = await prisma.properties.delete({
        where: { id: propertyInDb.id },
    })

    return result;
}

const deleteUserInDb = async (id: string) => {
    const userInDb = await prisma.user.findUnique({
        where: { id }
    })
    if (!userInDb) {
        throw appError(`No such user found.`, 404)
    }

    const result = await prisma.user.delete({
        where: { id: userInDb.id },
    })

    return result;
}


export const adminServices = {
    getAllUsersFromDb,
    getAllPropertiesFromDb,
    getAllRentalRequestsFromDb,
    moderateUserInDb,
    deletePropertyInDb,
    deleteUserInDb
}