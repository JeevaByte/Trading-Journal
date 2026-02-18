import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { format } from "date-fns"

export default async function JournalPage() {
    const session = await auth()
    const journals = await prisma.journal.findMany({
        where: { userId: session?.user?.id },
        orderBy: { date: "desc" },
        take: 10
    })

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Daily Journal</h1>
                <Button asChild>
                    <Link href="/dashboard/journal/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Entry
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {journals.map((entry) => (
                    <Card key={entry.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {format(entry.date, "PPP")}
                            </CardTitle>
                            <span className="text-xs text-muted-foreground uppercase">{entry.type.replace("_", " ")}</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{entry.rating ? `${entry.rating}/5` : "-"}</div>
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-3">
                                {/* Basic content preview */}
                                {/* @ts-ignore - Content is Json but using string for mock */}
                                {typeof entry.content === 'string' ? entry.content : JSON.stringify(entry.content)}
                            </p>
                        </CardContent>
                    </Card>
                ))}
                {journals.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-10">
                        No journal entries yet. Start writing today!
                    </div>
                )}
            </div>
        </div>
    )
}
