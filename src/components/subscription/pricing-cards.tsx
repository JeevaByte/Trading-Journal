"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function PricingCards() {
    const handleUpgrade = (plan: string) => {
        // Integrate Razorpay flow here
        console.log(`Upgrading to ${plan}`)
        alert("Razorpay integration coming soon!")
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8 max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Basic Plan</CardTitle>
                    <CardDescription>Essential tools for beginner traders.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="text-4xl font-bold">Free</div>
                    <div className="text-sm text-muted-foreground">Forever free for basic usage.</div>
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Manual Trade Logging</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Basic Analytics (P&L, Win Rate)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Daily Journal</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>3 Strategy Playbooks</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" variant="outline" disabled>Current Plan</Button>
                </CardFooter>
            </Card>

            <Card className="border-primary relative overflow-hidden">
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">POPULAR</Badge>
                <CardHeader>
                    <CardTitle>Pro Plan</CardTitle>
                    <CardDescription>Advanced analytics and automation for serious traders.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="text-4xl font-bold">₹999<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                    <div className="text-sm text-muted-foreground">Billed monthly. Cancel anytime.</div>
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Everything in Basic</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Automated Broker Sync (Zerodha, etc.)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Advanced Charts (Heatmap, Equity Curve)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Unlimited Playbooks</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Mentor Access</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={() => handleUpgrade("PRO")}>Upgrade to Pro</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
