import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { propertiesServices } from "./properties.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status"

const createNewListing = handleAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const userId = req.user?.id
        const result = await propertiesServices.createNewListingInDb(payload, userId as string)

        sendResponse(res, {
            success: true,
            statusCode: status.CREATED,
            message: `New listing for this property created.`,
            data: result
        })
    }
)

const updateListing = handleAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const payload = req.body
        const userId = req.user?.id
        const result = await propertiesServices.updateListingInDb(id, payload, userId as string)

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: `Updated.`,
            data: result
        })
    }
)

const getAllListings = handleAsync(
    async (req: Request, res: Response) => {
        const filters = req.query;
        const result = await propertiesServices.getAllPropertiesFromDb(filters)
        const totalCount = result.length

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: `Fetched all properties.`,
            data: {
                result,
                totalCount
            }
        })
    }
)

const getPropertyDetails = handleAsync(
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const result = await propertiesServices.getPropertyDetailsFromDb(id as string)

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: `Fetched property with id ${id}.`,
            data: {
                result
            }
        })
    }
)

const getAllCategories = handleAsync(
    async (req: Request, res: Response) => {
        const result = await propertiesServices.getAllCategoriesFromDb()

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: `Fetched all categories`,
            data: result
        }
        )
    }
)

export const propertiesControllers = {
    createNewListing,
    updateListing,
    getAllListings,
    getPropertyDetails,
    getAllCategories
}