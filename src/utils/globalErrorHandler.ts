import { NextFunction, Request, Response } from "express";
import status from "http-status"

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || status.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: (err as Error).message || "Something went wrong.",
        error: err.stack
    })
}