import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, Book } from "lucide-react"

export default async function PlaybooksPage() {
    const session = await auth()
    const playbooks = await prisma.playbook.findMany({
        where: { userId: session?.user?.id },
        orderBy: { updatedAt: "desc" },
    })

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Strategy Playbooks</h1>
                <Button asChild>
                    <Link href="/dashboard/playbooks/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Playbook
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {playbooks.map((Book) => (
                    <Card key={Book.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Book className="h-5 w-5 text-primary" />
                                {Book.name}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                                {Book.description || "No description"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">
                                {Book.tags.map(tag => <span key={tag} className="mr-2 bg-secondary px-2 py-1 rounded-md text-xs">{tag}</span>)}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {playbooks.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-10">
                        No playbooks created yet. Define your strategies to track performance.
                    </div>
                )}
            </div>
        </div>
    )
}
