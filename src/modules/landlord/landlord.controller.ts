import { NextFunction, Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { landlordServices } from "./landlord.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status"

export const deleteListing = handleAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id
        const userId = req.user?.id
        const userRole = req.user?.role

        const result = await landlordServices.deleteListingFromDb(id as string, userId as string, userRole as string)

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: `Deleted : ${result.id} `,
            data: null
        })
    }
)

export const landlordController = {
    deleteListing
}