import { PlaybookForm } from "@/components/forms/playbook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewPlaybookPage() {
    return (
        <div className="max-w-3xl mx-auto py-10">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Create Strategy Playbook</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Define Your Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                    <PlaybookForm />
                </CardContent>
            </Card>
        </div>
    )
}
