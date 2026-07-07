import { UserRoles } from "../../../generated/prisma/enums"

export interface IModerateUser {
    name?: string,
    email?: string,
    role?: UserRoles,
    profilePhoto?: string,
    is_banned?: boolean
}