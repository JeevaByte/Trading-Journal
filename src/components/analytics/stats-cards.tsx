import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Activity, TrendingUp, Target } from "lucide-react"

interface StatsProps {
    totalPnl: number
    winRate: number
    totalTrades: number
    avgR: number
}

export function StatsCards({ totalPnl, winRate, totalTrades, avgR }: StatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${totalPnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(totalPnl)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        +20.1% from last month
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">
                        Based on {totalTrades} trades
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalTrades}</div>
                    <p className="text-xs text-muted-foreground">
                        +12 this week
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Risk:Reward</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1:{avgR.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                        Target: 1:2.0
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
