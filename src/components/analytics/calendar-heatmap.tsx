"use client"

import {
    eachDayOfInterval,
    endOfYear,
    format,
    getDay,
    isSameDay,
    startOfYear
} from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface HeatmapData {
    date: string // ISO string
    value: number // P&L
    count: number // Number of trades
}

interface CalendarHeatmapProps {
    data: HeatmapData[]
    year?: number
}

export function CalendarHeatmap({ data, year = new Date().getFullYear() }: CalendarHeatmapProps) {
    const startDate = startOfYear(new Date(year, 0, 1))
    const endDate = endOfYear(new Date(year, 0, 1))

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate
    })

    // Create a padded array to ensure alignment
    // We want the grid to flow by column (weeks), with 7 rows (days)
    // Row 0 = Sunday, Row 1 = Monday, ... Row 6 = Saturday
    const startDayOfWeek = getDay(startDate) // 0 (Sun) to 6 (Sat)
    const paddedDays = Array.from({ length: startDayOfWeek }).fill(null).concat(days)

    const getColor = (value?: number) => {
        if (value === undefined || value === 0) return "bg-muted"
        if (value > 0) {
            if (value > 10000) return "bg-green-600"
            if (value > 5000) return "bg-green-500"
            if (value > 1000) return "bg-green-400"
            return "bg-green-300"
        } else {
            if (value < -10000) return "bg-red-600"
            if (value < -5000) return "bg-red-500"
            if (value < -1000) return "bg-red-400"
            return "bg-red-300"
        }
    }

    return (
        <div className="w-full overflow-x-auto pb-4">
            <div className="flex flex-col gap-2">
                <div className="flex text-xs text-muted-foreground ml-8 gap-[13px]">
                    {/* Minimal Month Labels - approximate positions, could be improved */}
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                </div>
                <div className="flex gap-2">
                    <div className="flex flex-col justify-between text-[10px] text-muted-foreground h-[112px] pb-1">
                        <span>Sun</span>
                        <span>Tue</span>
                        <span>Thu</span>
                        <span>Sat</span>
                    </div>
                    <div className="grid grid-rows-7 grid-flow-col gap-1 h-max">
                        {paddedDays.map((day, index) => {
                            if (!day) return <div key={`pad-${index}`} className="h-3 w-3" />

                            const dayData = data.find(d => isSameDay(new Date(d.date), day as Date))
                            const value = dayData?.value || 0
                            const count = dayData?.count || 0

                            return (
                                <TooltipProvider key={(day as Date).toISOString()}>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div
                                                className={`h-3 w-3 rounded-[2px] ${getColor(value)} transition-colors hover:ring-2 hover:ring-ring hover:ring-offset-1`}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            <div className="text-xs">
                                                <p className="font-bold">{format(day as Date, "MMM d, yyyy")}</p>
                                                <p className={value >= 0 ? "text-green-500" : "text-red-500"}>
                                                    {value !== 0 ? (value > 0 ? "+" : "") + new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value) : "No P&L"}
                                                </p>
                                                <p className="text-muted-foreground">{count} trades</p>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
