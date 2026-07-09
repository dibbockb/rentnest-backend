import { NextFunction, Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { paymentServices } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status"

const createCheckoutSession = handleAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const rentalRequestId = req.params.rentalRequestId
        const userId = req.user?.id;

        const result = await paymentServices.createCheckoutSession(rentalRequestId as string, userId as string)
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: `Created checkout session.`,
            data: {
                sessionUrl: result,
            }
        })
    }
)

export const paymentControllers = {
    createCheckoutSession
}