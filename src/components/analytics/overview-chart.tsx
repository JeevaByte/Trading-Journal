"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface Trade {
    entryDate: string
    netPnl: number
}

interface OverviewChartProps {
    data: Trade[]
}

export function OverviewChart({ data }: OverviewChartProps) {
    // Process data for cumulative P&L
    const chartData = data
        .sort((a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime())
        .reduce((acc: { date: string; cumulativePnl: number; pnl: number }[], trade) => {
            const lastPnl = acc.length > 0 ? acc[acc.length - 1].cumulativePnl : 0
            acc.push({
                date: new Date(trade.entryDate).toLocaleDateString(),
                cumulativePnl: lastPnl + (trade.netPnl || 0),
                pnl: trade.netPnl
            })
            return acc
        }, [])

    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
                <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: "#333", border: "none" }}
                    labelStyle={{ color: "#fff" }}
                />
                <Line
                    type="monotone"
                    dataKey="cumulativePnl"
                    stroke="#adfa1d"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
