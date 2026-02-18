import { auth } from "@/auth"
import { ChatWindow } from "@/components/community/chat-window"
import { TradeFeed } from "@/components/community/trade-feed"
import { redirect } from "next/navigation"

export default async function CommunityPage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/auth/login")
    }

    return (
        <div className="flex-1 space-y-4 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Community</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-4 h-full">
                {/* Chat Area */}
                <div className="md:col-span-3">
                    <ChatWindow />
                </div>

                {/* Sidebar / Online Users / Mentors */}
                <div className="hidden md:block md:col-span-1 space-y-4">
                    <div className="rounded-xl border bg-card text-card-foreground shadow p-4">
                        <h3 className="font-semibold mb-2">Mentors Online</h3>
                        <p className="text-sm text-muted-foreground">Coming soon...</p>
                    </div>

                    <div className="rounded-xl border bg-card text-card-foreground shadow p-4">
                        <h3 className="font-semibold mb-2">Trending Ideas</h3>
                        <TradeFeed />
                    </div>
                </div>
            </div>
        </div>
    )
}
