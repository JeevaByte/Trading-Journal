import * as z from "zod"

export const playbookFormSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().optional(),
    market: z.string().optional(),
    entryRules: z.string().optional(),
    exitTp: z.string().optional(),
    exitSl: z.string().optional(),
    positionSizing: z.string().optional(),
    riskRules: z.string().optional(),
    tags: z.string().optional(), // Comma separated
})

export type PlaybookFormValues = z.infer<typeof playbookFormSchema>
