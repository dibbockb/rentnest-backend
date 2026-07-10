import z from "zod"
import { UserRoles } from "../../../generated/prisma/enums"

export const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid Email"),
    password: z.string(),
    role: z.enum(["TENANT", "LANDLORD"]).optional(),
    profilePhoto: z.string().url("Invalid Photo Url").optional(),
})

export const loginSchema = z.object({
    email: z.string().email("Invalid Email"),
    password: z.string()
})