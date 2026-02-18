import Link from "next/link"
import { NotificationList } from "@/components/notifications/notification-list"
import {
    LayoutDashboard,
    LineChart,
    BookOpen,
    Users,
    Settings,
    LogOut,
    PlusCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 md:flex-row">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
                <div className="flex h-14 items-center border-b px-6 lg:h-[60px]">
                    <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                        <LineChart className="h-6 w-6" />
                        <span className="">Trading Journal</span>
                    </Link>
                </div>
                <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
                    <Button asChild variant="secondary" className="w-full justify-start mb-4">
                        <Link href="/dashboard/trades/create">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Log Trade
                        </Link>
                    </Button>

                    <Button asChild variant="ghost" className="w-full justify-start">
                        <Link href="/dashboard">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Overview
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start">
                        <Link href="/dashboard/journal">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Journal
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start">
                        <Link href="/dashboard/analytics">
                            <LineChart className="mr-2 h-4 w-4" />
                            Analytics
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start">
                        <Link href="/dashboard/community">
                            <Users className="mr-2 h-4 w-4" />
                            Community
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start">
                        <Link href="/dashboard/subscription">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Subscription
                        </Link>
                    </Button>
                </nav>
                <div className="mt-auto p-4 border-t">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>
            <main className="flex-1 md:ml-64 transition-all duration-300 ease-in-out">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
                    <div className="flex-1">
                        {/* Search or breadcrumbs could go here */}
                    </div>
                    <NotificationList />
                </header>
                <div className="p-4 lg:p-6 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
