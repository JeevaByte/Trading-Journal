"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { playbookFormSchema, type PlaybookFormValues } from "@/lib/validations/playbook"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export type ActionState = {
    success: boolean
    message: string
    errors?: Record<string, string[]>
}

export async function createPlaybook(data: PlaybookFormValues): Promise<ActionState> {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return {
                success: false,
                message: "Unauthorized",
            }
        }

        const validatedFields = playbookFormSchema.safeParse(data)

        if (!validatedFields.success) {
            return {
                success: false,
                message: "Validation Error",
                errors: validatedFields.error.flatten().fieldErrors,
            }
        }

        const {
            name,
            description,
            market,
            entryRules,
            exitTp,
            exitSl,
            positionSizing,
            riskRules,
            tags,
        } = validatedFields.data

        await prisma.playbook.create({
            data: {
                userId: session.user.id,
                name,
                description,
                market,
                entryRules,
                exitTp,
                exitSl,
                positionSizing,
                riskRules,
                tags: tags ? tags.split(",").map((t) => t.trim()) : [],
            },
        })

        revalidatePath("/dashboard/playbook")
        return {
            success: true,
            message: "Playbook created successfully",
        }
    } catch (error) {
        console.error("Failed to create playbook:", error)
        return {
            success: false,
            message: "Failed to create playbook",
        }
    }
}
