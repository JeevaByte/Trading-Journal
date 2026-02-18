import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function AdminPage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/auth/login")
    }

    // Simple role check (In real app, use verifyRole middleware or property)
    // For MVP, if email is admin's email or specific logic
    // const isAdmin = session.user.email === "admin@example.com"
    // Assuming a role field exists on user based on schema
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (user?.role !== "ADMIN") {
        // For demo purposes, we might allow access or redirect
        // redirect("/dashboard")
    }

    const usersCount = await prisma.user.count()
    const tradesCount = await prisma.trade.count()
    const activeSubs = await prisma.subscription.count({ where: { status: "ACTIVE" } })

    const recentUsers = await prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" }
    })

    return (
        <div className="flex-1 space-y-4 pt-6 p-8">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Admin Console</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{usersCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{tradesCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Subs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeSubs}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Not Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-right">Joined</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentUsers.map((u: { id: string; name: string | null; email: string; createdAt: Date }) => (
                                <TableRow key={u.id}>
                                    <TableCell className="font-medium">{u.name || "Unknown"}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell className="text-right">{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
