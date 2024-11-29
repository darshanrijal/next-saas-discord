import { z } from "zod"

const requiredString = (message?: string) => z.string().min(1, { message })

export const createEventCategorySchema = z.object({
  name: requiredString("Name is required").regex(
    /^[a-zA-Z0-9-]+$/,
    "Category name can only contain letters numbers and hyphens",
  ),
  color: requiredString().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
  emoji: z.string().emoji("Invalid emoji").optional(),
})
export type CreateEventCategoryValues = z.infer<
  typeof createEventCategorySchema
>
