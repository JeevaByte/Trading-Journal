import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Trade {
    id: string
    instrument: string
    netPnl: number
    entryDate: Date
    direction: string // "LONG" | "SHORT"
    quantity: number
}

interface RecentTradesProps {
    trades: Trade[]
}

export function RecentTrades({ trades }: RecentTradesProps) {
    return (
        <div className="space-y-8">
            {trades.map((trade) => (
                <div key={trade.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarFallback className={trade.netPnl >= 0 ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}>
                            {trade.direction === "LONG" ? "L" : "S"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{trade.instrument}</p>
                        <p className="text-xs text-muted-foreground">
                            {new Date(trade.entryDate).toLocaleDateString()} • {trade.quantity} Qty
                        </p>
                    </div>
                    <div className={`ml-auto font-medium ${trade.netPnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {trade.netPnl > 0 ? "+" : ""}{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(trade.netPnl)}
                    </div>
                </div>
            ))}

            {trades.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-4">
                    No trades recorded yet.
                </div>
            )}
        </div>
    )
}
