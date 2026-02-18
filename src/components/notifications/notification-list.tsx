"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NotificationList() {
    // Mock notifications for MVP
    const notifications = [
        { id: 1, message: "Welcome to Trading Journal!", read: false },
        { id: 2, message: "Market is open.", read: true },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((n) => (
                    <DropdownMenuItem key={n.id} className="cursor-pointer">
                        <div className={`flex flex-col gap-1 ${!n.read ? "font-semibold" : ""}`}>
                            <span>{n.message}</span>
                            <span className="text-xs text-muted-foreground">Just now</span>
                        </div>
                    </DropdownMenuItem>
                ))}
                {notifications.length === 0 && (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        No new notifications
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
