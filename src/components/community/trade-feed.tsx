"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, MessageSquare, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TradeIdea {
    id: string
    user: {
        name: string
        image?: string
        tier: string
    }
    symbol: string
    direction: "LONG" | "SHORT"
    entry: number
    target: number
    stopLoss: number
    analysis: string
    votes: number
    comments: number
    createdAt: string
}

const MOCK_IDEAS: TradeIdea[] = [
    {
        id: "1",
        user: { name: "ProTrader_X", tier: "PRO" },
        symbol: "RELIANCE",
        direction: "LONG",
        entry: 2450,
        target: 2500,
        stopLoss: 2420,
        analysis: "Breakout from ascending triangle pattern on 1H timeframe with high volume.",
        votes: 24,
        comments: 5,
        createdAt: "2h ago"
    },
    {
        id: "2",
        user: { name: "CryptoKing", tier: "BASIC" },
        symbol: "BTC/USDT",
        direction: "SHORT",
        entry: 42000,
        target: 40500,
        stopLoss: 42500,
        analysis: "Rejection from strong resistance at 42k. RDA diverging.",
        votes: 12,
        comments: 2,
        createdAt: "5h ago"
    }
]

export function TradeFeed() {
    return (
        <div className="space-y-4">
            {MOCK_IDEAS.map((idea) => (
                <Card key={idea.id}>
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <Avatar>
                            <AvatarImage src={idea.user.image} />
                            <AvatarFallback>{idea.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">{idea.user.name}</span>
                                {idea.user.tier === "PRO" && (
                                    <Badge variant="secondary" className="text-[10px] h-4 px-1">PRO</Badge>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground">{idea.createdAt}</span>
                        </div>
                        <div className={`ml-auto px-2 py-1 rounded text-xs font-bold ${idea.direction === "LONG" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                            {idea.direction}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold text-lg">{idea.symbol}</h4>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                                <span className="text-muted-foreground block text-xs">Entry</span>
                                <span className="font-mono">{idea.entry}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-xs">Target</span>
                                <span className="font-mono text-green-500">{idea.target}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-xs">Stop</span>
                                <span className="font-mono text-red-500">{idea.stopLoss}</span>
                            </div>
                        </div>

                        <p className="text-sm text-foreground/90">{idea.analysis}</p>

                        <div className="flex items-center gap-4 pt-2">
                            <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground">
                                <ThumbsUp className="w-4 h-4" />
                                {idea.votes}
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground">
                                <MessageSquare className="w-4 h-4" />
                                {idea.comments}
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 ml-auto text-muted-foreground">
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
