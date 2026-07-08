import { NextFunction, Request, Response } from "express"
import { handleAsync } from "../../utils/handleAsync"
import { rentalServices } from "./rental.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status"

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

export const rentalControllers = {
    submitRentalRequest,
}