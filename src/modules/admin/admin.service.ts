import { prisma } from "../../lib/prisma"

const getAllUsersFromDb = async () => {
    const result = await prisma.user.findMany({
        omit: { password: true }
    })
    return result;
}

const getAllPropertiesFromDb = async () => {
    const result = await prisma.properties.findMany({
        include: { }
    })
    return result;
}


export const adminServices = {
    getAllUsersFromDb,
    getAllPropertiesFromDb
}