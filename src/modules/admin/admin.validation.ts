import z from "zod";
import { UserRoles } from "../../../generated/prisma/enums";

export const moderateUserSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    role: z.string().trim().toUpperCase().pipe(z.enum(UserRoles)).optional(),
    profilePhoto: z.string().url().optional(),
    is_banned: z.boolean().optional(),
})