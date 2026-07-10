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

const handleWebhook = handleAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const event = req.body as Buffer;
        const signature = req.headers['stripe-signature']

        try {
            await paymentServices.handleWebhook(event, signature as string)
            res.status(status.OK).json({ recived: true })
        } catch (error: any) {
            console.error(`Webhook processing failed: ${error.message}`);
            res.status(status.BAD_REQUEST).send(`Webhook error: ${error.message}`)
        }
    }
)

const getMyPaymentHistory = handleAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id;

        const result = await paymentServices.getMyPaymentHistoryFromDB(userId as string)
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: `Fetched all payments for this user.`,
            data: {
                payments: result,
            }
        })
    }
)

const getPaymentDetails = handleAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id
        const txId = req.params.id

        const result = await paymentServices.getPaymentDetailsFromDb(userId as string, txId as string)
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: `Fetched payment details`,
            data: {
                payments: result,
            }
        })
    }
)

export const paymentControllers = {
    createCheckoutSession,
    handleWebhook,
    getMyPaymentHistory,
    getPaymentDetails
}