"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { type ParsedTrade } from "@/lib/csv-parsers"
import { revalidatePath } from "next/cache"

export type ActionState = {
    success: boolean
    message: string
    count?: number
}

export async function processCsvUpload(trades: ParsedTrade[]): Promise<ActionState> {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return {
                success: false,
                message: "Unauthorized: You must be logged in to upload trades.",
            }
        }

        if (!trades || trades.length === 0) {
            return {
                success: false,
                message: "No trades to process.",
            }
        }

        const userId = session.user.id

        // Map parsed trades to database model
        const tradeData = trades.map((t) => {
            const entryPrice = t.entryPrice
            const exitPrice = t.exitPrice
            const quantity = t.quantity
            const direction = t.direction

            // Calculate PnL (Gross)
            let grossPnl = 0
            if (direction === "LONG") {
                grossPnl = (exitPrice - entryPrice) * quantity
            } else {
                grossPnl = (entryPrice - exitPrice) * quantity
            }

            const fees = t.fees || 0
            const netPnl = grossPnl - fees

            // Calculate ROI %
            const investedCapital = entryPrice * quantity
            const percentGainLoss = investedCapital > 0 ? (netPnl / investedCapital) * 100 : 0

            return {
                userId,
                instrument: t.instrument,
                market: t.market,
                direction: t.direction,
                entryPrice,
                exitPrice,
                quantity,
                fees,
                netPnl,
                percentGainLoss,
                entryDate: t.entryDate,
                exitDate: t.exitDate,
                source: "CSV",
                rrRatio: 0,
                notes: "",
            }
        })

        // Use transaction to ensure all or nothing (or createMany if simple)
        // createMany is faster for bulk inserts
        const result = await prisma.trade.createMany({
            data: tradeData,
            skipDuplicates: true, // Optional: skip if unique constraint violated
        })

        revalidatePath("/dashboard/trades")
        return {
            success: true,
            message: `Successfully imported ${result.count} trades!`,
            count: result.count,
        }
    } catch (error) {
        console.error("Failed to process CSV upload:", error)
        return {
            success: false,
            message: "Database Error: Failed to save trades.",
        }
    }
}
