import * as z from "zod"

export const tradeFormSchema = z.object({
    instrument: z.string().min(1, "Instrument is required"),
    market: z.enum(["NSE", "BSE", "FOREX", "CRYPTO", "US_FUTURES"]),
    direction: z.enum(["LONG", "SHORT"]),
    entryDate: z.date({
        required_error: "Entry date is required",
    }),
    exitDate: z.date({
        required_error: "Exit date is required",
    }),
    entryPrice: z.coerce.number().positive("Entry price must be positive"),
    exitPrice: z.coerce.number().positive("Exit price must be positive"),
    quantity: z.coerce.number().positive("Quantity must be positive"),
    stopLoss: z.coerce.number().positive("Stop loss must be positive").optional(),
    takeProfit: z.coerce.number().positive("Take profit must be positive").optional(),
    fees: z.coerce.number().min(0, "Fees cannot be negative").optional().default(0),
    setupRating: z.enum(["A+", "A", "B", "C"]).optional(),
    emotionalState: z.string().optional(),
    marketConditions: z.string().optional(),
    notes: z.string().optional(),
    strategyId: z.string().optional(),
    tags: z.string().optional(), // Comma separated tags logic handled in UI
    screenshots: z.any().optional(), // File list or array of strings
})

export type TradeFormValues = z.infer<typeof tradeFormSchema>
