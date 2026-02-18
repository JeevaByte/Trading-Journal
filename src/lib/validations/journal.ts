import * as z from "zod"

export const journalFormSchema = z.object({
    date: z.date({
        required_error: "Date is required",
    }),
    type: z.enum(["PRE_MARKET", "POST_MARKET", "WEEKLY"]),
    content: z.string().min(10, "Journal content must be at least 10 characters"),
    // For Rich Text, content might be JSON string or HTML string. 
    // For MVP, we use simple textarea or Tiptap HTML content string.
    rating: z.coerce.number().min(1).max(5).optional(),
    isShared: z.boolean().default(false),
})

export type JournalFormValues = z.infer<typeof journalFormSchema>
