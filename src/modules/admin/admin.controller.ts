import { NextFunction, Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { adminServices } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status"

const getAllUsers =
    handleAsync(async (req: Request, res: Response) => {
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

const getAllRentalRequests =
    handleAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await adminServices.getAllRentalRequestsFromDb()

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: `Fetched all rental requests.`,
            data: { result }
        })
    })


const moderateUser =
    handleAsync(async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id
        const payload = req.body
        const result = await adminServices.moderateUserInDb(id as string, payload)

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: `Updated user info.`,
            data: result
        })
    })

export const adminControllers = {
    getAllUsers,
    getAllProperties,
    getAllRentalRequests,
    moderateUser
}