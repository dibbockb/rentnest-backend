import { NextFunction, Request, Response } from "express"
import { UserRoles } from "../../generated/prisma/enums"
import { handleAsync } from "../utils/handleAsync"
import { tokenUtils } from "../utils/tokens"
import envConfig from "../config/envConfig"
import { JwtPayload } from "jsonwebtoken"
import { prisma } from "../lib/prisma"


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
                throw new Error(`Unable to fetch cookies. Please try loggin in again.`)
            }

            const verifiedToken = tokenUtils.verifyToken(token, envConfig.jwt_access_secret)
            if (!verifiedToken) {
                throw new Error(`Unable to verify token`)
            }

            const { email, name, id, role } = verifiedToken.data as JwtPayload

            if (!requiredRoles.includes(role)) {
                throw new Error(`Forbidden.`)
            }

            const user = await prisma.user.findUnique({
                where: {
                    id, email, name, role
                }
            })

            if (!user) {
                throw new Error(`User not found.`)
            }

            if (user.is_banned) {
                throw new Error(`You have been banned from RentNest. Please contact support if you think this is a mistake.`)
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