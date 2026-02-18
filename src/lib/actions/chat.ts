"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { messageSchema } from "@/lib/validations/message"
import { revalidatePath } from "next/cache"

export async function sendMessage(formData: FormData) {
    const session = await auth()

    if (!session?.user?.id) {
        return { error: "Unauthorized" }
    }

    const rawData = {
        content: formData.get("content"),
        channel: formData.get("channel") || "general",
    }

    const validatedFields = messageSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return { error: "Invalid fields" }
    }

    const { content, channel } = validatedFields.data

    try {
        await prisma.message.create({
            data: {
                content,
                channel,
                userId: session.user.id,
            },
        })

        // In a real-time app we'd push to socket
        // For polling, we just need to ensure DB is updated
        return { success: true }
    } catch (error) {
        console.error("Failed to send message:", error)
        return { error: "Failed to send message" }
    }
}
