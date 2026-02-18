import { auth } from "@/auth"
import { PricingCards } from "@/components/subscription/pricing-cards"
import { redirect } from "next/navigation"

export default async function SubscriptionPage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/auth/login")
    }

    return (
        <div className="flex-1 space-y-4 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Subscription</h2>
                <p className="text-muted-foreground">Manage your plan and billing.</p>
            </div>

            <div className="py-8">
                <PricingCards />
            </div>
        </div>
    )
}
