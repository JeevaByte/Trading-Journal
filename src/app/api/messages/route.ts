import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const session = await auth()

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const channel = searchParams.get("channel") || "general"

    try {
        const messages = await prisma.message.findMany({
            where: { channel },
            orderBy: { createdAt: "asc" }, // Oldest first for chat log
            take: 100, // Limit to last 100 messages
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                        id: true
                    }
                }
            }
        })

        return NextResponse.json(messages)
    } catch (error) {
        console.error("Failed to fetch messages:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
