import { NextFunction, Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { landlordServices } from "./landlord.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status"
import { RentalRequestStatus } from "../../../generated/prisma/enums";

const getAllProperties = handleAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id

        const result = await landlordServices.getAllPropertiesFromDb(userId as string)
        const totalCount = result.length
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: `Fetched all properties for landlord : ${userId}`,
            data: { result, totalCount }
        })
    }
)

const getAllRequests = handleAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id;
        const result = await landlordServices.getAllRequestsFromDb(userId as string)
        const totalCount = result.length

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: `Fetched all properties and rental requests`,
            data: { result, totalCount }
        })
    })

const manageRequest = handleAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const requestId = req.params.requestId
        const userId = req.user?.id
        const isAccepted = req.query?.accept == 'true';
        const statusAction = isAccepted ? RentalRequestStatus.APPROVED : RentalRequestStatus.REJECTED

        const result = await landlordServices.manageRequestInDb(requestId as string, userId as string, statusAction)
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: `Updated status for this request. `,
            data: result
        })
    }
)

const deleteListing = handleAsync(
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

export const landlordControllers = {
    getAllProperties,
    getAllRequests,
    deleteListing,
    manageRequest
}