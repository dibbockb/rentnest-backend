import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { handleAsync } from "../utils/handleAsync";

export const validateRequest = (schema: ZodType) => {
    return handleAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            req.body = await schema.parseAsync(req.body)
            next()
        }
    )
}