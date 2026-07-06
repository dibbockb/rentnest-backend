import { hash } from "node:crypto";
import envConfig from "../../config/envConfig";
import { prisma } from "../../lib/prisma";
import { IRegisterUser } from "./auth.interface";
import bcrypt from "bcryptjs"
import { UserRoles } from "../../../generated/prisma/enums";

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




export const authServices = {
    registerUserIntoDb
}