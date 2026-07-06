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

const loginUser =
    handleAsync(async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;
        const { accessToken, refreshToken } = await authServices.loginUserIntoDb(payload)

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 30
        })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 7
        })

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: `Logged in successfully.`,
            data: { accessToken, refreshToken }
        })
    })

const refreshToken =
    handleAsync(async (req: Request, res: Response, next: NextFunction) => {
        const refreshToken = req.cookies.refreshToken
        const { accessToken } = await authServices.refreshToken(refreshToken)

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 30
        })

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: `Token refreshed.`,
            data: { accessToken }
        })
    })

export const authControllers = {
    registerUser,
    loginUser,
    refreshToken
}