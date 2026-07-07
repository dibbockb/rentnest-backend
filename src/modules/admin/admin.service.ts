import { prisma } from "../../lib/prisma"

const getAllUsersFromDb = async () => {
    const result = await prisma.user.findMany({
        omit: { password: true }
    })
    return result;
}


export const adminServices = {
    getAllUsersFromDb
}