import { NextFunction, Request, Response } from "express"
import { handleAsync } from "../../utils/handleAsync"
import { rentalServices } from "./rental.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status"
import { UserRoles } from "../../../generated/prisma/enums";

const getMyRequests = handleAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id

        const result = await rentalServices.getMyRequestsFromDb(userId as string)
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: `Fetched All Requests for ${req.user?.id}`,
            data: { result }
        })
    }
)

const getRequestDetails = handleAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id;
        const requestId = req.params.id;


        const result = await rentalServices.getRequestDetailsFromDB(userId as string, requestId as string, req.user?.role as UserRoles)
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: `Fetched Request details for ${requestId}`,
            data: { result }
        })
    }
)

const submitRentalRequest = handleAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const propertyId = req.params.id;
        const requestedBy = req.user?.id;

        const result = await rentalServices.submitRentalRequestInDb(propertyId as string, requestedBy as string)
        sendResponse(res, {
            success: true,
            statusCode: status.CREATED,
            message: `Request submitted. Please wait until landlord approves.`,
            data: { result }
        })
    }
)

const submitReview = handleAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body
        const propertyId = req.params.propertyId
        const userId = req.user?.id

        const result = await rentalServices.submitReviewInDb(payload, propertyId as string, userId as string)
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: `Review submitted.`,
            data: { result }
        })
    }
)

export const rentalControllers = {
    submitRentalRequest,
    getMyRequests,
    getRequestDetails,
    submitReview
}