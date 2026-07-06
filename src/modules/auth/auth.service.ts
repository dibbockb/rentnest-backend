import envConfig from "../../config/envConfig";
import { prisma } from "../../lib/prisma";
import { ILoginUser, IRegisterUser } from "./auth.interface";
import bcrypt from "bcryptjs"
import { UserRoles } from "../../../generated/prisma/enums";
import { tokenUtils } from "../../utils/tokens";
import { JwtPayload, SignOptions } from "jsonwebtoken";

const registerUserIntoDb = async (payload: IRegisterUser) => {
    const { name, email, password, role, profilePhoto } = payload;
    if (role && !Object.values(UserRoles).includes(role)) {
        throw new Error(`Please enter a valid role`);
    }

    const isUserInDb = await prisma.user.findUnique({
        where: { email }
    })
    if (isUserInDb) {
        throw new Error(`User with same email already exists.`)
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
    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    })

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error(`Invalid Credentials.`)
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
        throw new Error(`Unable to verify refresh token ${verifiedResult.error || 'Invalid Token'}`)
    }

    const { id } = verifiedResult.data as JwtPayload
    const user = await prisma.user.findUniqueOrThrow({
        where: { id }
    })

    if (user.is_banned) {
        throw new Error(`User is Banned`)
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



export const authServices = {
    registerUserIntoDb,
    loginUserIntoDb,
    refreshToken
}