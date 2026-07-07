import { Prisma } from "../../../generated/prisma/browser";
import { prisma } from "../../lib/prisma";
import { INewProperty, IPropertyFilters, IUpdateProperty } from "./properties.interface";

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

const updateListingInDb = async (id: any, payload: IUpdateProperty, userId: string) => {
    const propertyInDb = await prisma.properties.findUnique({
        where: { id }
    })
    if (!propertyInDb) {
        throw new Error(`No post found for id : ${id}`)
    }

    const isCreator = propertyInDb.landlord_id === userId
    if (!isCreator) {
        throw new Error(`Unauthorized action.`)
    }

    const { category_name, ...restPayload } = payload;
    const updateData: Prisma.PropertiesUpdateInput = {
        ...restPayload,
        price: restPayload.price !== undefined ? Number(restPayload.price) : undefined
    };

    if (category_name) {
        const cleanCategoryName = category_name.trim().toLowerCase();

        updateData.category = {
            connectOrCreate: {
                where: { name: cleanCategoryName },
                create: { name: cleanCategoryName }
            }
        };
    }

    const result = await prisma.properties.update({
        where: { id: propertyInDb.id },
        data: updateData
    })
    return result
}

const getAllPropertiesFromDb = async (filters: IPropertyFilters) => {
    const { location, price, category_name } = filters;

    const whereConditions: Prisma.PropertiesWhereInput = {
        is_available: true,
        landlord: { is_banned: false }
    }

    if (location) {
        whereConditions.location = {
            contains: location.trim(),
            mode: 'insensitive'
        }
    }
    if (price) {
        whereConditions.price = {
            lte: Number(price)
        }
    }
    if (category_name) {
        whereConditions.category = {
            name: {
                equals: category_name.trim().toLowerCase()
            }
        }
    }

    const result = await prisma.properties.findMany({
        where: whereConditions,
        include: { category: true }
    })

    return result;

}


export const propertiesServices = {
    createNewListingInDb,
    updateListingInDb,
    getAllPropertiesFromDb
}