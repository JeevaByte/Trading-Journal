"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { tradeFormSchema, type TradeFormValues } from "@/lib/validations/trade"
import { revalidatePath } from "next/cache"

export type ActionState = {
    success: boolean
    message: string
    errors?: Record<string, string[]>
}

export async function createTrade(data: TradeFormValues): Promise<ActionState> {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return {
                success: false,
                message: "Unauthorized: You must be logged in to create a trade.",
            }
        }

        const validatedFields = tradeFormSchema.safeParse(data)

        if (!validatedFields.success) {
            return {
                success: false,
                message: "Validation Error",
                errors: validatedFields.error.flatten().fieldErrors,
            }
        }

        const {
            instrument,
            market,
            direction,
            entryDate,
            exitDate,
            entryPrice,
            exitPrice,
            quantity,
            fees,
            stopLoss,
            takeProfit,
            strategyId,
            setupRating,
            notes,
        } = validatedFields.data

        // Calculations
        const grossPnl =
            direction === "LONG"
                ? (exitPrice - entryPrice) * quantity
                : (entryPrice - exitPrice) * quantity

        const netPnl = grossPnl - fees
        const percentGainLoss = (netPnl / (entryPrice * quantity)) * 100

        // Risk Reward Calculation (Approximate)
        let rrRatio = 0
        if (stopLoss) {
            const risk = Math.abs(entryPrice - stopLoss)
            const reward = Math.abs(exitPrice - entryPrice)
            if (risk !== 0) {
                rrRatio = reward / risk
            }
        }

        await prisma.trade.create({
            data: {
                userId: session.user.id,
                instrument,
                market,
                direction,
                entryDate,
                exitDate,
                entryPrice,
                exitPrice,
                quantity,
                fees,
                stopLoss,
                takeProfit,
                strategyId: strategyId === "NO_STRATEGY" ? undefined : strategyId, // Handle optional strategy
                setupRating,
                notes,
                netPnl,
                percentGainLoss,
                rrRatio,
                source: "MANUAL",
            },
        })

        revalidatePath("/dashboard/trades")
        return {
            success: true,
            message: "Trade created successfully!",
        }
    } catch (error) {
        console.error("Failed to create trade:", error)
        return {
            success: false,
            message: "Database Error: Failed to create trade.",
        }
    }
}
