import { NextFunction, Request, Response } from "express";
import status from "http-status"
import { ZodError } from "zod";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ZodError) {
        return res.status(status.BAD_REQUEST).json({
            success: false,
            statusCode: status.BAD_REQUEST,
            message: "Schema verification failed",
            errorDetails: err.issues.map(issue => ({
                field: issue.path.join("."),
                message: issue.message
            }))
        })
    }

    const statusCode = err.statusCode || status.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: (err as Error).message || "Something went wrong.",
        errorDetails: err.message
    })
}