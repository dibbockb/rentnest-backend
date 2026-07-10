import z from "zod";

export const reviewSchema = z.object({
    stars: z.number().int().min(1).max(5),
    content: z.string().min(1, "Review content is required.")
})