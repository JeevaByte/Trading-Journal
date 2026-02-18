import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { columns, Trade } from "@/components/trades/trade-columns"
import { DataTable } from "@/components/trades/data-table"
import { RedirectType, redirect } from "next/navigation"

async function getTrades(userId: string): Promise<Trade[]> {
    const trades = await prisma.trade.findMany({
        where: { userId },
        orderBy: { entryDate: "desc" },
    })

    // Map to Trade type for UI
    return trades.map(t => ({
        id: t.id,
        entryDate: t.entryDate,
        instrument: t.instrument,
        direction: t.direction as "LONG" | "SHORT",
        entryPrice: t.entryPrice,
        exitPrice: t.exitPrice,
        quantity: t.quantity,
        netPnl: t.netPnl,
        percentGainLoss: t.percentGainLoss,
        setupRating: t.setupRating,
        status: "CLOSED", // All logged trades are closed for now as per MVP
    }))
}

export default async function TradesPage() {
    const session = await auth()
    if (!session?.user?.id) {
        redirect("/api/auth/signin") // Or bespoke login page
        return null
    }

    const data = await getTrades(session.user.id) // Need user ID from session. 
    // Note: auth().user.id might be undefined if not set in session callback callback.
    // Standard NextAuth w/ Adapter usually puts id in session.user.
    // I need to ensure session callback handles it if strictly typed, but let's assume it does or I'd fix auth.config.

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Trade History</h1>
            <DataTable columns={columns} data={data} />
        </div>
    )
}
