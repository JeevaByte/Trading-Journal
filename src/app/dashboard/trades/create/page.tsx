import { TradeEntryForm } from "@/components/forms/trade-entry-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export default async function CreateTradePage() {
    const session = await auth()
    const playbooks = await prisma.playbook.findMany({
        where: { userId: session?.user?.id },
        select: { id: true, name: true }
    })

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Log New Trade</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Trade Details</CardTitle>
                    <CardDescription>
                        Enter the details of your trade manually.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TradeEntryForm playbooks={playbooks} />
                </CardContent>
            </Card>
        </div>
    )
}
