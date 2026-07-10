import z from "zod";

export const createPropertySchema = z.object({
    location: z.string().min(1, "Location is required"),
    price: z.number().positive("Price must be greater than 0"),
    category_name: z.string().min(1, "Category name is required")
})

export const updatePropertySchema = createPropertySchema.partial()