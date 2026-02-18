import { CsvUploadForm } from "@/components/forms/csv-upload-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ImportTradesPage() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Import Trades</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Upload Broker Report</CardTitle>
                    <CardDescription>
                        Import your trades from supported brokers via CSV.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CsvUploadForm />
                </CardContent>
            </Card>
        </div>
    )
}
