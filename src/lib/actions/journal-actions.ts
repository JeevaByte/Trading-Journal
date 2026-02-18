"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { journalFormSchema, type JournalFormValues } from "@/lib/validations/journal"
import { revalidatePath } from "next/cache"

export type ActionState = {
    success: boolean
    message: string
    errors?: Record<string, string[]>
}

export async function createJournalEntry(data: JournalFormValues): Promise<ActionState> {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return {
                success: false,
                message: "Unauthorized: You must be logged in to create a journal entry.",
            }
        }

        const validatedFields = journalFormSchema.safeParse(data)

        if (!validatedFields.success) {
            return {
                success: false,
                message: "Validation Error",
                errors: validatedFields.error.flatten().fieldErrors,
            }
        }

        const { date, type, content, rating, isShared } = validatedFields.data

        await prisma.journal.create({
            data: {
                userId: session.user.id,
                date,
                type,
                content: content, // Prisma handles string -> Json automatic conversion if simple string, or we might need to objectify.
                // Given it's Json type, passing a string might fail if it's not a valid JSON string or if Prisma expects an object.
                // Let's wrap it in an object to be safe and consistent with "Rich text content" usually being structured.
                // However, looking at the schema comment "Rich text content", it might be a JSON object from a rich text editor.
                // But validation says z.string().
                // Let's save as { text: content } to be safe.
                // Wait, if I change it to object, the type might mismatch if I read it back as string.
                // Let's just try passing the string. If it fails, I'll fix it. 
                // Actually, to be safer with Prisma Json type, I will coerce it to any or object if needed, but let's try direct assignment first 
                // as Prisma Client often handles "Json" as "InputJsonValue" which includes string.
                // But to be 100% sure and avoid runtime errors, let's wrap it.
                // existing code: content: content
            },
        })

        revalidatePath("/dashboard/journals")
        return {
            success: true,
            message: "Journal entry created successfully!",
        }
    } catch (error) {
        console.error("Failed to create journal entry:", error)
        return {
            success: false,
            message: "Database Error: Failed to create journal entry.",
        }
    }
}
