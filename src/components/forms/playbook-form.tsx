"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
// import { toast } from "@/components/ui/use-toast"
import { toast } from "sonner"
import { playbookFormSchema, type PlaybookFormValues } from "@/lib/validations/playbook"
import { createPlaybook } from "@/lib/actions/playbook-actions"
import { useState } from "react"

export function PlaybookForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<PlaybookFormValues>({
        // @ts-ignore
        resolver: zodResolver(playbookFormSchema),
        defaultValues: {
            name: "",
        },
    })

    async function onSubmit(data: PlaybookFormValues) {
        setIsSubmitting(true)
        try {
            const result = await createPlaybook(data)

            if (result.success) {
                toast.success(result.message)
                form.reset()
            } else {
                toast.error(result.message)
                if (result.errors) {
                    console.error("Validation errors:", result.errors)
                }
            }
        } catch (error) {
            toast.error("Failed to save playbook")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Playbook Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Bullish Flag Breakout" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Brief description of the strategy..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="entryRules"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Entry Rules</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="- Rule 1..." className="min-h-[100px]" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="exitTp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Take Profit Rules</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="- Exit when..." className="min-h-[100px]" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="exitSl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stop Loss Rules</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="- SL at..." className="min-h-[100px]" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="riskRules"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Risk Management</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="- Max risk 1%..." className="min-h-[100px]" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Playbook
                </Button>
            </form>
        </Form>
    )
}
