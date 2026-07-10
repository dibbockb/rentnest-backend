import envConfig from "../../config/envConfig";
import { prisma } from "../../lib/prisma";
import { ILoginUser, IRegisterUser } from "./auth.interface";
import bcrypt from "bcryptjs"
import { tokenUtils } from "../../utils/tokens";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import { appError } from "../../utils/appError";

const registerUserIntoDb = async (payload: IRegisterUser) => {
    const { name, email, password, role, profilePhoto } = payload;

    const isUserInDb = await prisma.user.findUnique({
        where: { email }
    })
    if (isUserInDb) {
        throw appError(`User with same email already exists.`, 409)
    }

    const hashedPassword = await bcrypt.hash(password, Number(envConfig.bcrypt_salt_rounds))
    const result = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
            profilePhoto
        },
        omit: { password: true }
    })

    return result
}

const loginUserIntoDb = async (payload: ILoginUser) => {
    const { email, password } = payload;
    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        throw appError(`No such user exists.`, 404)
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw appError(`Invalid Credentials.`, 401)
    }

    const JwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = tokenUtils.createToken(
        JwtPayload,
        envConfig.jwt_access_secret,
        envConfig.jwt_access_expiry as SignOptions
    )

    const refreshToken = tokenUtils.createToken(
        JwtPayload,
        envConfig.jwt_refresh_secret,
        envConfig.jwt_refresh_expiry as SignOptions
    )

    return { accessToken, refreshToken }
}

const refreshToken = async (refreshToken: string) => {
    const verifiedResult = tokenUtils.verifyToken(refreshToken, envConfig.jwt_refresh_secret)

    if (!verifiedResult.success || !verifiedResult.data) {
        throw appError(`Unable to verify refresh token ${verifiedResult.error || 'Invalid Token'}`, 400)
    }

    const { id } = verifiedResult.data as JwtPayload
    const user = await prisma.user.findUnique({
        where: { id }
    })

    if (!user) {
        throw appError(`User not found`, 404)
    }

    if (user.is_banned) {
        throw appError(`User is Banned`, 403)
    }

    const payload = {
        id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = tokenUtils.createToken(payload, envConfig.jwt_access_secret, envConfig.jwt_access_expiry as SignOptions)
    return { accessToken }
}

const getCurrentUserFromDb = async (accessToken: string) => {
    if (!accessToken) {
        throw appError(`Unable to fetch user from cookie. Please try logging in again.`, 401)
    }

    const verifiedToken = tokenUtils.verifyToken(accessToken, envConfig.jwt_access_secret)
    if (!verifiedToken) {
        throw appError(`Unable to verify token`, 401)
    }

    const { id } = verifiedToken.data as JwtPayload

    const result = await prisma.user.findFirst({
        where: { id },
        omit: { password: true }
    })

    if (!result) {
        throw appError(`User not found`, 404)
    }
    return result;
}


export const authServices = {
    registerUserIntoDb,
    loginUserIntoDb,
    refreshToken,
    getCurrentUserFromDb
}