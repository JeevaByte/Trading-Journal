"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

// Define the shape of our data based on Schema (approx)
// For now use a type that matches the Prisma model output
export type Trade = {
    id: string
    entryDate: Date
    instrument: string
    direction: "LONG" | "SHORT"
    entryPrice: number
    exitPrice: number
    quantity: number
    netPnl: number
    percentGainLoss: number | null
    setupRating: string | null
    status: "OPEN" | "CLOSED" // Derived or stored
}

export const columns: ColumnDef<Trade>[] = [
    {
        accessorKey: "entryDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => format(row.getValue("entryDate"), "dd MMM yyyy"),
    },
    {
        accessorKey: "instrument",
        header: "Instrument",
    },
    {
        accessorKey: "direction",
        header: "Side",
        cell: ({ row }) => {
            const type = row.getValue("direction") as string
            return (
                <Badge variant={type === "LONG" ? "default" : "destructive"}>
                    {type}
                </Badge>
            )
        },
    },
    {
        accessorKey: "quantity",
        header: "Qty",
    },
    {
        accessorKey: "entryPrice",
        header: "Entry",
    },
    {
        accessorKey: "exitPrice",
        header: "Exit",
    },
    {
        accessorKey: "netPnl",
        header: () => <div className="text-right">P&L</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("netPnl"))
            const formatted = new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
            }).format(amount)

            return <div className={`text-right font-medium ${amount >= 0 ? "text-green-600" : "text-red-600"}`}>{formatted}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const trade = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(trade.id)}
                        >
                            Copy trade ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit trade</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
