import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { StatsCards } from "@/components/analytics/stats-cards"
import { Trade } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RecentTrades } from "@/components/analytics/recent-trades"
import { OverviewChart } from "@/components/analytics/overview-chart"

export default async function DashboardPage() {
    const session = await auth()

    // Mock data fetching or real aggregation
    const trades = await prisma.trade.findMany({
        where: { userId: session?.user?.id },
        orderBy: { entryDate: "desc" },
        take: 50 // Fetch recent 50 for chart
    })

    // Calculate stats
    const totalPnl = trades.reduce((acc: number, t: Trade) => acc + t.netPnl, 0)
    const wins = trades.filter(t => t.netPnl > 0).length
    const totalTrades = trades.length
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0
    const avgR = 1.5 // Placeholder until we store R multiple

    return (
        <div className="flex-1 space-y-4 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <StatsCards
                totalPnl={totalPnl}
                winRate={winRate}
                totalTrades={totalTrades}
                avgR={avgR}
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                        <CardDescription>
                            Cumulative P&L over time.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <OverviewChart data={trades.map(t => ({ ...t, entryDate: t.entryDate.toISOString() }))} />
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Trades</CardTitle>
                        <CardDescription>
                            Your latest trading activity.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RecentTrades trades={trades.slice(0, 5)} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
