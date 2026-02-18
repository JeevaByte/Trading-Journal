import { auth } from "@/auth"
import prisma from "@/lib/prisma"

import { CalendarHeatmap } from "@/components/analytics/calendar-heatmap"
import { StrategyComparisonChart } from "@/components/analytics/strategy-comparison"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { PrintButton } from "@/components/analytics/print-button"

export default async function AnalyticsPage() {
    const session = await auth()

    const trades = await prisma.trade.findMany({
        where: { userId: session?.user?.id },
        include: {
            playbook: true
        }
    })

    type TradeWithPlaybook = typeof trades[number]

    // Aggregate data for heatmap
    const heatmapData = trades.reduce((acc: { date: string; value: number; count: number }[], trade: TradeWithPlaybook) => {
        const dateStr = format(new Date(trade.entryDate), "yyyy-MM-dd")
        const existing = acc.find(d => d.date === dateStr)
        if (existing) {
            existing.value += trade.netPnl
            existing.count += 1
        } else {
            acc.push({
                date: dateStr,
                value: trade.netPnl,
                count: 1
            })
        }
        return acc
    }, [])

    // Aggregate data for strategy comparison
    const strategyData = trades.reduce((acc: { name: string; pnl: number; trades: number }[], trade: TradeWithPlaybook) => {
        const strategyName = trade.playbook?.name || "No Strategy"
        const existing = acc.find(s => s.name === strategyName)
        if (existing) {
            existing.pnl += trade.netPnl
            existing.trades += 1
        } else {
            acc.push({
                name: strategyName,
                pnl: trade.netPnl,
                trades: 1
            })
        }
        return acc
    }, [])

    return (
        <div className="flex-1 space-y-4 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                <div className="flex items-center space-x-2">
                    <PrintButton />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Calendar Heatmap</CardTitle>
                        <CardDescription>
                            Daily P&L performance.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CalendarHeatmap data={heatmapData} />
                    </CardContent>
                </Card>

                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Strategy Performance</CardTitle>
                        <CardDescription>
                            Comparative P&L by strategy.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <StrategyComparisonChart data={strategyData} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
