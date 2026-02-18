"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
// import { toast } from "@/components/ui/use-toast"
import { toast } from "sonner"
import { journalFormSchema, type JournalFormValues } from "@/lib/validations/journal"
import { createJournalEntry } from "@/lib/actions/journal-actions"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"

export function JournalEntryForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<JournalFormValues>({
        // @ts-ignore
        resolver: zodResolver(journalFormSchema),
        defaultValues: {
            type: "PRE_MARKET",
            isShared: false,
        },
    })

    async function onSubmit(data: JournalFormValues) {
        setIsSubmitting(true)
        try {
            const result = await createJournalEntry(data)

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
            toast.error("Failed to save journal")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Session Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="PRE_MARKET">Pre-Market Plan</SelectItem>
                                        <SelectItem value="POST_MARKET">Post-Market Review</SelectItem>
                                        <SelectItem value="WEEKLY">Weekly Review</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="What's your plan? How did you perform?"
                                    className="min-h-[200px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Supports markdown (in future).
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex items-center gap-6">
                    <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Daily Rating (1-5)</FormLabel>
                                <FormControl>
                                    <Input type="number" min="1" max="5" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isShared"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm flex-1 mt-6">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                        Share with Mentor
                                    </FormLabel>
                                    <FormDescription>
                                        Allow your mentor to see this entry.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Entry
                </Button>
            </form>
        </Form>
    )
}
