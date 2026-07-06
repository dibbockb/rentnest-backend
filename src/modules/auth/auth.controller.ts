import { NextFunction, Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { authServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status"

const registerUser =
    handleAsync(async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;
        const user = await authServices.registerUserIntoDb(payload)

        sendResponse(res, {
            success: true,
            statusCode: status.CREATED,
            message: `User Registered Successfully.`,
            data: { user }
        })
    })


export const authControllers = {
    registerUser
}