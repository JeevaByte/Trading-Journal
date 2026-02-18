import { JournalEntryForm } from "@/components/forms/journal-entry-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewJournalPage() {
    return (
        <div className="max-w-3xl mx-auto py-10">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">New Journal Entry</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Write Your Thoughts</CardTitle>
                </CardHeader>
                <CardContent>
                    <JournalEntryForm />
                </CardContent>
            </Card>
        </div>
    )
}
