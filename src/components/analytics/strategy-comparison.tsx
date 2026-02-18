"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts"

interface StrategyData {
    name: string
    pnl: number
    trades: number
}

interface StrategyComparisonChartProps {
    data: StrategyData[]
}

export function StrategyComparisonChart({ data }: StrategyComparisonChartProps) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
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
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                            const data = payload[0].payload as StrategyData
                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                Strategy
                                            </span>
                                            <span className="font-bold text-muted-foreground">
                                                {label}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                P&L
                                            </span>
                                            <span className={`font-bold ${data.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                                                {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(data.pnl)}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                Trades
                                            </span>
                                            <span className="font-bold text-muted-foreground">
                                                {data.trades}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        return null
                    }}
                />
                <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? "#22c55e" : "#ef4444"} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}
