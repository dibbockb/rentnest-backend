import { NextFunction, Request, Response } from "express"
import { UserRoles } from "../../generated/prisma/enums"
import { handleAsync } from "../utils/handleAsync"
import { tokenUtils } from "../utils/tokens"
import envConfig from "../config/envConfig"
import { JwtPayload } from "jsonwebtoken"
import { prisma } from "../lib/prisma"
import { appError } from "../utils/appError"


///toUnderstand
declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string,
                name?: string,
                id: string,
                role: UserRoles
            }
        }
    }
}

export const auth = (...requiredRoles: UserRoles[]) => {
    return handleAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const token = req.cookies.accessToken
            if (!token) {
                throw appError(`Unable to fetch cookies. Please try loggin in again.`, 401)
            }

            const verifiedToken = tokenUtils.verifyToken(token, envConfig.jwt_access_secret)
            if (!verifiedToken) {
                throw appError(`Unable to verify token`, 401)
            }

            const { email, name, id, role } = verifiedToken.data as JwtPayload

            if (!requiredRoles.includes(role)) {
                throw appError(`Forbidden.`, 403)
            }

            const user = await prisma.user.findUnique({
                where: {
                    id, email, name, role
                }
            })

            if (!user) {
                throw appError(`User not found.`, 404)
            }

            if (user.is_banned) {
                throw appError(`You have been banned from RentNest. Please contact support if you think this is a mistake.`, 403)
            }

            req.user = {
                email,
                name,
                id,
                role
            }

            next()
        }
    )
}