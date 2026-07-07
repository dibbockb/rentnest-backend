import { NextFunction, Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { adminServices } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status"

const getAllUsers =
    handleAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await adminServices.getAllUsersFromDb()

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: `Fetched all users from Database.`,
            data: result
        })
    })

const getAllProperties =
    handleAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await adminServices.getAllPropertiesFromDb()

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: `Fetched all properties from Database.`,
            data: result
        })
    })


export const adminControllers = {
    getAllUsers,
    getAllProperties
}