import { UserRoles } from "../../../generated/prisma/enums";

export interface IRegisterUser {
    name: string,
    email: string,
    password: string,
    role?: UserRoles,
    profilePhoto?: string
}