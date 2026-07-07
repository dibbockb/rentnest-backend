import { prisma } from "../../lib/prisma";
import { INewProperty } from "./properties.interface";

const createNewListingInDb = async (payload: INewProperty, userId: string) => {
    const { category_name, location, price } = payload;
    const normalizedCategory = category_name.trim().toLocaleLowerCase()

    if (!category_name || !location || price === undefined) {
        throw new Error(`Please enter all required fields: Location, Price, Category Name`)
    }
    const categoryRecord = await prisma.categories.upsert({
        where: { name: normalizedCategory },
        update: {},
        create: { name: normalizedCategory }
    })

    const result = await prisma.properties.create({
        data: {
            location,
            price: Number(price),
            landlord_id: userId,
            category_id: categoryRecord.id
        }
    })

    return result;

    ///add input validation
}


export const propertiesServices = {
    createNewListingInDb
}