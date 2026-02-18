"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, UploadCloud } from "lucide-react"

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
// import { toast } from "@/components/ui/use-toast"
import { toast } from "sonner"
import { parseBrokerCSV, type ParsedTrade } from "@/lib/csv-parsers"
import { processCsvUpload } from "@/lib/actions/csv-actions"

const csvFormSchema = z.object({
    broker: z.enum(["ZERODHA", "ANGEL_ONE", "UPSTOX"]),
    file: z.instanceof(FileList).refine((files) => files?.length === 1, "File is required")
})

type CsvFormValues = z.infer<typeof csvFormSchema>

export function CsvUploadForm() {
    const [isParsing, setIsParsing] = useState(false)
    const [parsedTrades, setParsedTrades] = useState<ParsedTrade[]>([])

    const form = useForm<CsvFormValues>({
        // @ts-ignore - Validating FileList is tricky with zodResolver sometimes
        resolver: zodResolver(csvFormSchema),
        defaultValues: {
            broker: "ZERODHA",
        },
    })

    // Manual file handling since React Hook Form + File Input + Shadcn Input is tricky
    // Actually, we can use a controlled input wrapper or just register
    const fileRef = form.register("file")

    async function onSubmit(data: CsvFormValues) {
        setIsParsing(true)
        try {
            const file = data.file[0]
            const trades = await parseBrokerCSV(file, data.broker as any)
            setParsedTrades(trades)
            toast.success(`Parsed ${trades.length} trades successfully`)
            // TODO: Send to backend to save
        } catch (error) {
            console.error(error)
            toast.error("Failed to parse CSV")
        } finally {
            setIsParsing(false)
        }
    }

    const handleSave = async () => {
        try {
            const result = await processCsvUpload(parsedTrades)
            if (result.success) {
                toast.success(result.message)
                setParsedTrades([])
                form.reset()
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to save trades")
        }
    }

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="broker"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select Broker</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select broker" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="ZERODHA">Zerodha (Tradebook)</SelectItem>
                                        <SelectItem value="ANGEL_ONE">Angel One</SelectItem>
                                        <SelectItem value="UPSTOX">Upstox</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="file"
                        render={({ field: { onChange, onBlur, name, ref } }) => (
                            <FormItem>
                                <FormLabel>Upload CSV</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        accept=".csv"
                                        onChange={(e) => {
                                            onChange(e.target.files)
                                        }}
                                        onBlur={onBlur}
                                        name={name}
                                        ref={ref}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Upload your trade report CSV file.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={isParsing}>
                        {isParsing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isParsing ? "Parsing..." : "Parse CSV"}
                    </Button>
                </form>
            </Form>

            {parsedTrades.length > 0 && (
                <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-4">Preview ({parsedTrades.length} trades)</h3>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                        {parsedTrades.map((t, i) => (
                            <div key={i} className="text-sm p-2 bg-muted rounded flex justify-between">
                                <span>{t.entryDate.toLocaleDateString()} - {t.instrument} ({t.direction})</span>
                                <span>Qty: {t.quantity} | P: {t.entryPrice}</span>
                            </div>
                        ))}
                    </div>
                    <Button onClick={handleSave} className="mt-4 w-full">Confirm & Import</Button>
                </div>
            )}
        </div>
    )
}
