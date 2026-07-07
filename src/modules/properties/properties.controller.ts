import { Request, Response, response } from "express";
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


export const propertiesControllers = {
    createNewListing
}